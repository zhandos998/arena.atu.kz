import ArenaIcon from '@/Components/ArenaIcon';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import RichTextEditor from '@/Components/RichTextEditor';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const textareaClassName = 'mt-2 block w-full rounded-xl border-[#ccd7e8] dark:border-[#3a506e] bg-white dark:bg-[#142238] px-4 py-3 font-mono text-sm text-[#142d55] dark:text-[#e8eef9] shadow-sm placeholder:font-sans placeholder:text-[#9aa8ba] dark:placeholder:text-[#94a9c4] focus:border-[#355da8] dark:focus:border-[#91b8ff] focus:ring-[#355da8] dark:focus:ring-[#91b8ff]';

export default function ProblemForm({ competition, problem = null }) {
    const editing = Boolean(problem);
    const initialSamples = problem?.samples?.length
        ? problem.samples.map((sample) => ({ input: sample.input, output: sample.output }))
        : [{ input: '', output: '' }];
    const { data, setData, post, put, processing, errors } = useForm({
        code: problem?.code ?? '',
        title: problem?.title ?? '',
        statement: problem?.statement ?? '',
        input_format: problem?.input_format ?? '',
        output_format: problem?.output_format ?? '',
        constraints: problem?.constraints ?? '',
        time_limit_ms: problem?.time_limit_ms ?? 1000,
        memory_limit_mb: problem?.memory_limit_mb ?? 256,
        score: problem?.score ?? 100,
        samples: initialSamples,
    });

    const submit = (event) => {
        event.preventDefault();

        if (editing) {
            put(route('admin.competitions.problems.update', [competition.id, problem.id]));
            return;
        }

        post(route('admin.competitions.problems.store', competition.id));
    };

    const updateSample = (index, field, value) => {
        setData('samples', data.samples.map((sample, sampleIndex) => (
            sampleIndex === index ? { ...sample, [field]: value } : sample
        )));
    };

    const addSample = () => {
        if (data.samples.length < 10) {
            setData('samples', [...data.samples, { input: '', output: '' }]);
        }
    };

    const removeSample = (index) => {
        if (data.samples.length > 1) {
            setData('samples', data.samples.filter((_, sampleIndex) => sampleIndex !== index));
        }
    };

    return (
        <AdminLayout title={editing ? 'Редактирование задачи' : 'Новая задача'} subtitle={competition.title}>
            <Head title={`${editing ? 'Изменить' : 'Добавить'} задачу — ${competition.title}`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex min-w-0 items-center gap-2 text-sm">
                    <Link href={route('admin.competitions.index')} className="shrink-0 font-bold text-[#355da8] dark:text-[#a9c7ff] hover:text-[#23457e]">Соревнования</Link>
                    <span className="text-[#a2adbc] dark:text-[#a8b9d1]">/</span>
                    <Link href={route('admin.competitions.show', competition.id)} className="truncate font-bold text-[#355da8] dark:text-[#a9c7ff] hover:text-[#23457e]">{competition.title}</Link>
                    <span className="text-[#a2adbc] dark:text-[#a8b9d1]">/</span>
                    <span className="shrink-0 text-[#7184a0] dark:text-[#aebfd6]">{editing ? 'Изменение' : 'Новая задача'}</span>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <form onSubmit={submit} className="rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] p-5 shadow-sm sm:p-8">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#355da8] dark:text-[#a9c7ff]">Условие и примеры</p>
                            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#142d55] dark:text-[#e8eef9]">{editing ? 'Изменить задачу' : 'Добавить задачу'}</h1>
                            <p className="mt-2 text-sm leading-6 text-[#7184a0] dark:text-[#aebfd6]">Заполните условие, ограничения и публичные примеры ввода и вывода.</p>
                        </div>

                        <div className="mt-7 grid gap-5">
                            <div className="grid gap-5 sm:grid-cols-[120px_minmax(0,1fr)]">
                                <div>
                                    <InputLabel htmlFor="code" value="Код" />
                                    <TextInput id="code" value={data.code} className="mt-2 block w-full font-mono uppercase" placeholder="A" maxLength="10" isFocused={!editing} onChange={(event) => setData('code', event.target.value.toUpperCase())} required />
                                    <InputError message={errors.code} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="title" value="Название задачи" />
                                    <TextInput id="title" value={data.title} className="mt-2 block w-full" placeholder="Конечные автоматы" onChange={(event) => setData('title', event.target.value)} required />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="statement" value="Условие" />
                                <RichTextEditor id="statement" value={data.statement} onChange={(value) => setData('statement', value)} allowImages />
                                <InputError message={errors.statement} className="mt-2" />
                            </div>

                            <div className="grid gap-5 lg:grid-cols-2">
                                <div>
                                    <InputLabel htmlFor="input_format" value="Формат входных данных" />
                                    <RichTextEditor id="input_format" value={data.input_format} onChange={(value) => setData('input_format', value)} minHeight="150px" />
                                    <InputError message={errors.input_format} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="output_format" value="Формат выходных данных" />
                                    <RichTextEditor id="output_format" value={data.output_format} onChange={(value) => setData('output_format', value)} minHeight="150px" />
                                    <InputError message={errors.output_format} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="constraints" value="Ограничения" />
                                <RichTextEditor id="constraints" value={data.constraints} onChange={(value) => setData('constraints', value)} minHeight="110px" />
                                <InputError message={errors.constraints} className="mt-2" />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-3">
                                <div>
                                    <InputLabel htmlFor="time_limit_ms" value="Время, мс" />
                                    <TextInput id="time_limit_ms" type="number" min="100" max="10000" step="100" value={data.time_limit_ms} className="mt-2 block w-full" onChange={(event) => setData('time_limit_ms', event.target.value)} required />
                                    <InputError message={errors.time_limit_ms} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="memory_limit_mb" value="Память, МБ" />
                                    <TextInput id="memory_limit_mb" type="number" min="16" max="1024" step="16" value={data.memory_limit_mb} className="mt-2 block w-full" onChange={(event) => setData('memory_limit_mb', event.target.value)} required />
                                    <InputError message={errors.memory_limit_mb} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="score" value="Баллы" />
                                    <TextInput id="score" type="number" min="1" max="1000" value={data.score} className="mt-2 block w-full" onChange={(event) => setData('score', event.target.value)} required />
                                    <InputError message={errors.score} className="mt-2" />
                                </div>
                            </div>

                            <section className="border-t border-[#edf1f7] dark:border-[#2d405b] pt-6">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-lg font-black text-[#142d55] dark:text-[#e8eef9]">Публичные примеры</h2>
                                        <p className="mt-1 text-xs leading-5 text-[#8795a9] dark:text-[#a4b6cf]">Их увидят участники в условии. Это не скрытые тесты.</p>
                                    </div>
                                    <button type="button" onClick={addSample} disabled={data.samples.length >= 10} className="inline-flex items-center justify-center rounded-xl border border-[#b8c9e4] dark:border-[#516e95] px-4 py-2.5 text-xs font-black text-[#355da8] dark:text-[#a9c7ff] transition hover:bg-[#edf3ff] dark:hover:bg-[#203858] disabled:opacity-40">
                                        + Добавить пример
                                    </button>
                                </div>
                                <InputError message={errors.samples} className="mt-3" />

                                <div className="mt-5 grid gap-4">
                                    {data.samples.map((sample, index) => (
                                        <article key={index} className="rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-[#f8faff] dark:bg-[#17263e] p-4 sm:p-5">
                                            <div className="flex items-center justify-between gap-3">
                                                <h3 className="text-sm font-black text-[#314765] dark:text-[#d2dff1]">Пример №{index + 1}</h3>
                                                {data.samples.length > 1 && (
                                                    <button type="button" onClick={() => removeSample(index)} className="text-xs font-bold text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-300">Удалить</button>
                                                )}
                                            </div>
                                            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                                <div>
                                                    <InputLabel htmlFor={`sample-input-${index}`} value="INPUT.TXT" />
                                                    <textarea id={`sample-input-${index}`} value={sample.input} rows="7" className={textareaClassName} placeholder={'4\n2 0\n13 20\n5 23\n18 6'} onChange={(event) => updateSample(index, 'input', event.target.value)} required />
                                                    <InputError message={errors[`samples.${index}.input`]} className="mt-2" />
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor={`sample-output-${index}`} value="OUTPUT.TXT" />
                                                    <textarea id={`sample-output-${index}`} value={sample.output} rows="7" className={textareaClassName} placeholder={'44344\n48134\n45699\n49458'} onChange={(event) => updateSample(index, 'output', event.target.value)} required />
                                                    <InputError message={errors[`samples.${index}.output`]} className="mt-2" />
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#edf1f7] dark:border-[#2d405b] pt-6 sm:flex-row sm:justify-end">
                            <Link href={editing ? route('admin.competitions.problems.show', [competition.id, problem.id]) : route('admin.competitions.show', competition.id)} className="inline-flex items-center justify-center rounded-xl border border-[#ccd7e8] dark:border-[#3a506e] px-5 py-3 text-sm font-bold text-[#667892] dark:text-[#aebfd6] transition hover:bg-[#f3f6fb] dark:hover:bg-[#0c1628]">Отмена</Link>
                            <button type="submit" disabled={processing} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#355da8] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#355da8]/20 transition hover:bg-[#294f91] disabled:cursor-not-allowed disabled:opacity-60">
                                <ArenaIcon name="check" className="h-4 w-4" />
                                {processing ? 'Сохраняем…' : editing ? 'Сохранить изменения' : 'Добавить задачу'}
                            </button>
                        </div>
                    </form>

                    <aside className="h-fit rounded-2xl bg-[#193f7d] p-6 text-white xl:sticky xl:top-24">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#ffd83d]"><ArenaIcon name="code" className="h-6 w-6" /></span>
                        <h2 className="mt-5 text-lg font-black">Предпросмотр</h2>
                        <p className="mt-2 text-xs leading-5 text-[#9eb3d3]">После сохранения откроется страница задачи в том виде, в котором она будет представлена участникам.</p>
                        <div className="mt-5 rounded-xl bg-[#0f2f63] p-4 font-mono text-xs leading-6 text-[#d8e3f5]">
                            <p><span className="text-[#ffd83d]">Код:</span> {data.code || 'A'}</p>
                            <p><span className="text-[#ffd83d]">Время:</span> {data.time_limit_ms || 0} мс</p>
                            <p><span className="text-[#ffd83d]">Память:</span> {data.memory_limit_mb || 0} МБ</p>
                            <p><span className="text-[#ffd83d]">Примеров:</span> {data.samples.length}</p>
                        </div>
                    </aside>
                </div>
            </div>
        </AdminLayout>
    );
}
