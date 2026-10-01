import ArenaIcon from '@/Components/ArenaIcon';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const textareaClass = 'mt-2 block w-full rounded-xl border-[#ccd7e8] dark:border-[#3a506e] bg-white dark:bg-[#142238] px-4 py-3 font-mono text-xs leading-5 text-[#142d55] dark:text-[#e8eef9] shadow-sm focus:border-[#355da8] dark:focus:border-[#91b8ff] focus:ring-[#355da8] dark:focus:ring-[#91b8ff]';

function emptyTest() {
    return { input: '', expected_output: '', points: 1, is_enabled: true };
}

export default function Index({ competition, problem, options }) {
    const { flash } = usePage().props;
    const [importValue, setImportValue] = useState('');
    const [importError, setImportError] = useState('');
    const testsForm = useForm({
        tests: problem.tests.length ? problem.tests : [emptyTest()],
    });
    const settingsForm = useForm({
        checker_type: problem.checker_type ?? 'tokens',
        reference_language: problem.reference_language ?? 'cpp',
        reference_solution: problem.reference_solution ?? '',
    });

    const updateTest = (index, field, value) => {
        testsForm.setData('tests', testsForm.data.tests.map((test, testIndex) => (
            testIndex === index ? { ...test, [field]: value } : test
        )));
    };

    const addTests = (count = 1) => {
        const available = Math.max(0, 200 - testsForm.data.tests.length);
        testsForm.setData('tests', [
            ...testsForm.data.tests,
            ...Array.from({ length: Math.min(count, available) }, emptyTest),
        ]);
    };

    const removeTest = (index) => {
        testsForm.setData('tests', testsForm.data.tests.filter((_, testIndex) => testIndex !== index));
    };

    const importJson = () => {
        try {
            const parsed = JSON.parse(importValue);

            if (!Array.isArray(parsed) || parsed.length > 200) {
                throw new Error('Ожидается массив максимум из 200 тестов.');
            }

            const imported = parsed.map((test) => ({
                input: String(test.input ?? ''),
                expected_output: String(test.expected_output ?? test.output ?? ''),
                points: Number(test.points ?? 1),
                is_enabled: test.is_enabled ?? true,
            }));

            testsForm.setData('tests', imported);
            setImportError('');
        } catch (error) {
            setImportError(error.message || 'Не удалось прочитать JSON.');
        }
    };

    const saveTests = (event) => {
        event.preventDefault();
        testsForm.put(route('admin.competitions.problems.tests.update', [competition.id, problem.id]), { preserveScroll: true });
    };

    const saveSettings = (event) => {
        event.preventDefault();
        settingsForm.put(route('admin.competitions.problems.judge-settings.update', [competition.id, problem.id]), { preserveScroll: true });
    };

    return (
        <AdminLayout title="Тесты и проверка" subtitle={`${problem.code}. ${problem.title}`}>
            <Head title={`Тесты — ${problem.code}. ${problem.title}`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {flash?.success && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#bfe9d5] dark:border-[#2b715d] bg-[#e8f8f1] dark:bg-[#123b31] px-4 py-3 text-sm font-bold text-[#16845a] dark:text-[#86dfb4]">
                        <ArenaIcon name="check" className="h-5 w-5" />
                        {flash.success}
                    </div>
                )}

                <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
                    <Link href={route('admin.competitions.show', competition.id)} className="font-bold text-[#355da8] dark:text-[#a9c7ff]">{competition.title}</Link>
                    <span className="text-[#a2adbc] dark:text-[#a8b9d1]">/</span>
                    <Link href={route('admin.competitions.problems.show', [competition.id, problem.id])} className="font-bold text-[#355da8] dark:text-[#a9c7ff]">Задача {problem.code}</Link>
                    <span className="text-[#a2adbc] dark:text-[#a8b9d1]">/</span>
                    <span className="text-[#7184a0] dark:text-[#aebfd6]">Скрытые тесты</span>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <form onSubmit={saveTests} className="min-w-0 rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] p-5 shadow-sm sm:p-7">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#355da8] dark:text-[#a9c7ff]">Набор проверки</p>
                                <h1 className="mt-2 text-2xl font-black text-[#142d55] dark:text-[#e8eef9]">Скрытые тесты ({testsForm.data.tests.length})</h1>
                                <p className="mt-2 text-sm text-[#7184a0] dark:text-[#aebfd6]">Участники не увидят входные данные и правильные ответы.</p>
                            </div>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => addTests(1)} className="rounded-xl border border-[#b8c9e4] dark:border-[#516e95] px-3 py-2 text-xs font-black text-[#355da8] dark:text-[#a9c7ff] hover:bg-[#edf3ff] dark:hover:bg-[#203858]">+ 1 тест</button>
                                <button type="button" onClick={() => addTests(10)} className="rounded-xl border border-[#b8c9e4] dark:border-[#516e95] px-3 py-2 text-xs font-black text-[#355da8] dark:text-[#a9c7ff] hover:bg-[#edf3ff] dark:hover:bg-[#203858]">+ 10 тестов</button>
                            </div>
                        </div>

                        <InputError message={testsForm.errors.tests} className="mt-4" />

                        {testsForm.data.tests.length === 0 ? (
                            <div className="mt-6 rounded-2xl border border-dashed border-[#bdcbe0] dark:border-[#415a78] bg-[#f8faff] dark:bg-[#17263e] px-6 py-10 text-center text-sm text-[#7184a0] dark:text-[#aebfd6]">Добавьте хотя бы один тест перед приёмом решений.</div>
                        ) : (
                            <div className="mt-6 grid gap-4">
                                {testsForm.data.tests.map((test, index) => (
                                    <article key={test.id ?? `new-${index}`} className="rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-[#f8faff] dark:bg-[#17263e] p-4 sm:p-5">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <h2 className="text-sm font-black text-[#314765] dark:text-[#d2dff1]">Тест №{index + 1}</h2>
                                            <div className="flex items-center gap-4">
                                                <label className="flex items-center gap-2 text-xs font-bold text-[#667892] dark:text-[#aebfd6]">
                                                    <input type="checkbox" checked={Boolean(test.is_enabled)} onChange={(event) => updateTest(index, 'is_enabled', event.target.checked)} className="rounded border-[#b8c9e4] dark:border-[#516e95] text-[#355da8] dark:text-[#a9c7ff] focus:ring-[#355da8] dark:focus:ring-[#91b8ff]" />
                                                    Активен
                                                </label>
                                                <button type="button" onClick={() => removeTest(index)} className="text-xs font-black text-red-600 dark:text-red-300">Удалить</button>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                            <div>
                                                <InputLabel htmlFor={`test-input-${index}`} value="Входные данные" />
                                                <textarea id={`test-input-${index}`} rows="8" value={test.input} onChange={(event) => updateTest(index, 'input', event.target.value)} className={textareaClass} />
                                                <InputError message={testsForm.errors[`tests.${index}.input`]} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor={`test-output-${index}`} value="Правильный ответ" />
                                                <textarea id={`test-output-${index}`} rows="8" value={test.expected_output} onChange={(event) => updateTest(index, 'expected_output', event.target.value)} className={textareaClass} />
                                                <InputError message={testsForm.errors[`tests.${index}.expected_output`]} className="mt-2" />
                                            </div>
                                        </div>

                                        <div className="mt-4 max-w-36">
                                            <InputLabel htmlFor={`test-points-${index}`} value="Вес теста" />
                                            <input id={`test-points-${index}`} type="number" min="1" max="1000" value={test.points} onChange={(event) => updateTest(index, 'points', event.target.value)} className="mt-2 block w-full rounded-xl border-[#ccd7e8] dark:border-[#3a506e] px-3 py-2 text-sm focus:border-[#355da8] dark:focus:border-[#91b8ff] focus:ring-[#355da8] dark:focus:ring-[#91b8ff]" />
                                            <InputError message={testsForm.errors[`tests.${index}.points`]} className="mt-2" />
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        <div className="mt-6 flex justify-end border-t border-[#edf1f7] dark:border-[#2d405b] pt-5">
                            <button type="submit" disabled={testsForm.processing} className="rounded-xl bg-[#355da8] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#355da8]/20 disabled:opacity-60">Сохранить тесты</button>
                        </div>
                    </form>

                    <aside className="grid h-fit gap-6 xl:sticky xl:top-24">
                        <form onSubmit={saveSettings} className="rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] p-5">
                            <h2 className="text-lg font-black text-[#142d55] dark:text-[#e8eef9]">Настройки проверки</h2>

                            <div className="mt-5">
                                <InputLabel htmlFor="checker_type" value="Checker" />
                                <select id="checker_type" value={settingsForm.data.checker_type} onChange={(event) => settingsForm.setData('checker_type', event.target.value)} className="mt-2 block w-full rounded-xl border-[#ccd7e8] dark:border-[#3a506e] px-4 py-3 text-sm focus:border-[#355da8] dark:focus:border-[#91b8ff] focus:ring-[#355da8] dark:focus:ring-[#91b8ff]">
                                    <option value="tokens">По токенам (рекомендуется)</option>
                                    <option value="exact">Точное совпадение</option>
                                </select>
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="reference_language" value="Язык эталонного решения" />
                                <select id="reference_language" value={settingsForm.data.reference_language} onChange={(event) => settingsForm.setData('reference_language', event.target.value)} className="mt-2 block w-full rounded-xl border-[#ccd7e8] dark:border-[#3a506e] px-4 py-3 text-sm focus:border-[#355da8] dark:focus:border-[#91b8ff] focus:ring-[#355da8] dark:focus:ring-[#91b8ff]">
                                    {options.languages.map((language) => <option key={language.value} value={language.value}>{language.label}</option>)}
                                </select>
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="reference_solution" value="Эталонное решение" />
                                <textarea id="reference_solution" rows="12" value={settingsForm.data.reference_solution} onChange={(event) => settingsForm.setData('reference_solution', event.target.value)} className={textareaClass} placeholder="Код решения администратора" />
                                <InputError message={settingsForm.errors.reference_solution} className="mt-2" />
                            </div>

                            <button type="submit" disabled={settingsForm.processing} className="mt-5 w-full rounded-xl bg-[#193f7d] px-4 py-3 text-sm font-black text-white disabled:opacity-60">Сохранить checker</button>
                        </form>

                        <section className="rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] p-5">
                            <h2 className="text-lg font-black text-[#142d55] dark:text-[#e8eef9]">Импорт JSON</h2>
                            <p className="mt-2 text-xs leading-5 text-[#7184a0] dark:text-[#aebfd6]">Массив объектов с полями <code>input</code>, <code>output</code> и необязательным <code>points</code>.</p>
                            <textarea rows="8" value={importValue} onChange={(event) => setImportValue(event.target.value)} className={textareaClass} placeholder={'[{"input":"2 3","output":"5"}]'} />
                            {importError && <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-300">{importError}</p>}
                            <button type="button" onClick={importJson} className="mt-4 w-full rounded-xl border border-[#b8c9e4] dark:border-[#516e95] px-4 py-3 text-sm font-black text-[#355da8] dark:text-[#a9c7ff] hover:bg-[#edf3ff] dark:hover:bg-[#203858]">Загрузить в форму</button>
                        </section>
                    </aside>
                </div>
            </div>
        </AdminLayout>
    );
}
