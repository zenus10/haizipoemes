declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"biographies": Record<string, {
  id: string;
  slug: string;
  body: string;
  collection: "biographies";
  data: any;
  render(): Render[".md"];
}>;
"poems": {
"essay/动作（《太阳·断头篇》代后记）.md": {
	id: "essay/动作（《太阳·断头篇》代后记）.md";
  slug: "essay/动作太阳断头篇代后记";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"essay/寂静（《但是水、水》原代后记）.md": {
	id: "essay/寂静（《但是水、水》原代后记）.md";
  slug: "essay/寂静但是水水原代后记";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"essay/寻找对实体的接触（《河流》原序）.md": {
	id: "essay/寻找对实体的接触（《河流》原序）.md";
  slug: "essay/寻找对实体的接触河流原序";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"essay/我热爱的诗人——荷尔德林.md": {
	id: "essay/我热爱的诗人——荷尔德林.md";
  slug: "essay/我热爱的诗人荷尔德林";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"essay/日记.md": {
	id: "essay/日记.md";
  slug: "essay/日记";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"essay/民间主题（《传说》原序）.md": {
	id: "essay/民间主题（《传说》原序）.md";
  slug: "essay/民间主题传说原序";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"essay/源头和鸟（《河流》原代后记）.md": {
	id: "essay/源头和鸟（《河流》原代后记）.md";
  slug: "essay/源头和鸟河流原代后记";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"essay/诗学-一份提纲.md": {
	id: "essay/诗学-一份提纲.md";
  slug: "essay/诗学-一份提纲";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"long/传说.md": {
	id: "long/传说.md";
  slug: "long/传说";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"long/但是水、水.md": {
	id: "long/但是水、水.md";
  slug: "long/但是水水";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"long/河流.md": {
	id: "long/河流.md";
  slug: "long/河流";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"long/神秘故事.md": {
	id: "long/神秘故事.md";
  slug: "long/神秘故事";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/七月不远.md": {
	id: "short/1983/七月不远.md";
  slug: "short/1983/七月不远";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/七月的大海.md": {
	id: "short/1983/七月的大海.md";
  slug: "short/1983/七月的大海";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/不幸.md": {
	id: "short/1983/不幸.md";
  slug: "short/1983/不幸";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/东方山脉.md": {
	id: "short/1983/东方山脉.md";
  slug: "short/1983/东方山脉";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/九月.md": {
	id: "short/1983/九月.md";
  slug: "short/1983/九月";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/九盏灯（组诗）.md": {
	id: "short/1983/九盏灯（组诗）.md";
  slug: "short/1983/九盏灯组诗";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/农耕民族.md": {
	id: "short/1983/农耕民族.md";
  slug: "short/1983/农耕民族";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/北斗七星七座村庄.md": {
	id: "short/1983/北斗七星七座村庄.md";
  slug: "short/1983/北斗七星七座村庄";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/半截的诗.md": {
	id: "short/1983/半截的诗.md";
  slug: "short/1983/半截的诗";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/历史.md": {
	id: "short/1983/历史.md";
  slug: "short/1983/历史";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/哑脊背.md": {
	id: "short/1983/哑脊背.md";
  slug: "short/1983/哑脊背";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/喜马拉雅.md": {
	id: "short/1983/喜马拉雅.md";
  slug: "short/1983/喜马拉雅";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/在昌平的孤独.md": {
	id: "short/1983/在昌平的孤独.md";
  slug: "short/1983/在昌平的孤独";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/坛子.md": {
	id: "short/1983/坛子.md";
  slug: "short/1983/坛子";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/城里.md": {
	id: "short/1983/城里.md";
  slug: "short/1983/城里";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/大自然.md": {
	id: "short/1983/大自然.md";
  slug: "short/1983/大自然";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/天鹅.md": {
	id: "short/1983/天鹅.md";
  slug: "short/1983/天鹅";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/女孩子.md": {
	id: "short/1983/女孩子.md";
  slug: "short/1983/女孩子";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/妻子和鱼.md": {
	id: "short/1983/妻子和鱼.md";
  slug: "short/1983/妻子和鱼";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/幸福.md": {
	id: "short/1983/幸福.md";
  slug: "short/1983/幸福";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/怅望祁连（之一）.md": {
	id: "short/1983/怅望祁连（之一）.md";
  slug: "short/1983/怅望祁连之一";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/怅望祁连（之二）.md": {
	id: "short/1983/怅望祁连（之二）.md";
  slug: "short/1983/怅望祁连之二";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/思念前生.md": {
	id: "short/1983/思念前生.md";
  slug: "short/1983/思念前生";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/感动.md": {
	id: "short/1983/感动.md";
  slug: "short/1983/感动";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/我们坐在一棵木头中.md": {
	id: "short/1983/我们坐在一棵木头中.md";
  slug: "short/1983/我们坐在一棵木头中";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/我的窗户里埋着一只为你祝福的杯子.md": {
	id: "short/1983/我的窗户里埋着一只为你祝福的杯子.md";
  slug: "short/1983/我的窗户里埋着一只为你祝福的杯子";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/房屋.md": {
	id: "short/1983/房屋.md";
  slug: "short/1983/房屋";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/抱着白虎走过海洋.md": {
	id: "short/1983/抱着白虎走过海洋.md";
  slug: "short/1983/抱着白虎走过海洋";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/敦煌.md": {
	id: "short/1983/敦煌.md";
  slug: "short/1983/敦煌";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/无题.md": {
	id: "short/1983/无题.md";
  slug: "short/1983/无题";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/日光.md": {
	id: "short/1983/日光.md";
  slug: "short/1983/日光";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/春天.md": {
	id: "short/1983/春天.md";
  slug: "short/1983/春天";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/春天（断片）.md": {
	id: "short/1983/春天（断片）.md";
  slug: "short/1983/春天断片";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/月.md": {
	id: "short/1983/月.md";
  slug: "short/1983/月";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/村庄.md": {
	id: "short/1983/村庄.md";
  slug: "short/1983/村庄";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/村庄_1.md": {
	id: "short/1983/村庄_1.md";
  slug: "short/1983/村庄_1";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/果园.md": {
	id: "short/1983/果园.md";
  slug: "short/1983/果园";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/歌-阳光打在地上.md": {
	id: "short/1983/歌-阳光打在地上.md";
  slug: "short/1983/歌-阳光打在地上";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/歌或哭.md": {
	id: "short/1983/歌或哭.md";
  slug: "short/1983/歌或哭";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/死亡之诗（之一）.md": {
	id: "short/1983/死亡之诗（之一）.md";
  slug: "short/1983/死亡之诗之一";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/死亡之诗（之二-采摘葵花）.md": {
	id: "short/1983/死亡之诗（之二-采摘葵花）.md";
  slug: "short/1983/死亡之诗之二-采摘葵花";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/河伯.md": {
	id: "short/1983/河伯.md";
  slug: "short/1983/河伯";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/泪水.md": {
	id: "short/1983/泪水.md";
  slug: "short/1983/泪水";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/浑曲.md": {
	id: "short/1983/浑曲.md";
  slug: "short/1983/浑曲";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/海上婚礼.md": {
	id: "short/1983/海上婚礼.md";
  slug: "short/1983/海上婚礼";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/海水没顶.md": {
	id: "short/1983/海水没顶.md";
  slug: "short/1983/海水没顶";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/海滩上为女士算命.md": {
	id: "short/1983/海滩上为女士算命.md";
  slug: "short/1983/海滩上为女士算命";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/燕子和蛇（组诗）.md": {
	id: "short/1983/燕子和蛇（组诗）.md";
  slug: "short/1983/燕子和蛇组诗";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/爱情诗集.md": {
	id: "short/1983/爱情诗集.md";
  slug: "short/1983/爱情诗集";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/粮食.md": {
	id: "short/1983/粮食.md";
  slug: "short/1983/粮食";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/给1986.md": {
	id: "short/1983/给1986.md";
  slug: "short/1983/给1986";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/给安徒生.md": {
	id: "short/1983/给安徒生.md";
  slug: "short/1983/给安徒生";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/给母亲（组诗）.md": {
	id: "short/1983/给母亲（组诗）.md";
  slug: "short/1983/给母亲组诗";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/给萨福.md": {
	id: "short/1983/给萨福.md";
  slug: "short/1983/给萨福";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/肉体（之二）.md": {
	id: "short/1983/肉体（之二）.md";
  slug: "short/1983/肉体之二";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/自杀者之歌.md": {
	id: "short/1983/自杀者之歌.md";
  slug: "short/1983/自杀者之歌";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/自画像.md": {
	id: "short/1983/自画像.md";
  slug: "short/1983/自画像";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/莫扎特在《安魂曲》中说.md": {
	id: "short/1983/莫扎特在《安魂曲》中说.md";
  slug: "short/1983/莫扎特在安魂曲中说";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/门关户闭.md": {
	id: "short/1983/门关户闭.md";
  slug: "short/1983/门关户闭";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/阿尔的太阳.md": {
	id: "short/1983/阿尔的太阳.md";
  slug: "short/1983/阿尔的太阳";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/马（断片）.md": {
	id: "short/1983/马（断片）.md";
  slug: "short/1983/马断片";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/黄金草原.md": {
	id: "short/1983/黄金草原.md";
  slug: "short/1983/黄金草原";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1983/龙.md": {
	id: "short/1983/龙.md";
  slug: "short/1983/龙";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/不要问我那绿色是什么.md": {
	id: "short/1984/不要问我那绿色是什么.md";
  slug: "short/1984/不要问我那绿色是什么";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/中国器乐.md": {
	id: "short/1984/中国器乐.md";
  slug: "short/1984/中国器乐";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/亚洲铜.md": {
	id: "short/1984/亚洲铜.md";
  slug: "short/1984/亚洲铜";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/单翅鸟.md": {
	id: "short/1984/单翅鸟.md";
  slug: "short/1984/单翅鸟";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/印度之夜.md": {
	id: "short/1984/印度之夜.md";
  slug: "short/1984/印度之夜";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/我，以及其他的证人.md": {
	id: "short/1984/我，以及其他的证人.md";
  slug: "short/1984/我以及其他的证人";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/新娘.md": {
	id: "short/1984/新娘.md";
  slug: "short/1984/新娘";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/春天的夜晚和早晨.md": {
	id: "short/1984/春天的夜晚和早晨.md";
  slug: "short/1984/春天的夜晚和早晨";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/木鱼儿.md": {
	id: "short/1984/木鱼儿.md";
  slug: "short/1984/木鱼儿";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/民间艺人.md": {
	id: "short/1984/民间艺人.md";
  slug: "short/1984/民间艺人";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/海上.md": {
	id: "short/1984/海上.md";
  slug: "short/1984/海上";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/煤堆.md": {
	id: "short/1984/煤堆.md";
  slug: "short/1984/煤堆";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/爱情故事.md": {
	id: "short/1984/爱情故事.md";
  slug: "short/1984/爱情故事";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/秋天.md": {
	id: "short/1984/秋天.md";
  slug: "short/1984/秋天";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/跳跃者.md": {
	id: "short/1984/跳跃者.md";
  slug: "short/1984/跳跃者";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1984/黑风.md": {
	id: "short/1984/黑风.md";
  slug: "short/1984/黑风";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/中午.md": {
	id: "short/1985/中午.md";
  slug: "short/1985/中午";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/为了美丽.md": {
	id: "short/1985/为了美丽.md";
  slug: "short/1985/为了美丽";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/主人.md": {
	id: "short/1985/主人.md";
  slug: "short/1985/主人";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/你的手.md": {
	id: "short/1985/你的手.md";
  slug: "short/1985/你的手";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/写给脖子上的菩萨.md": {
	id: "short/1985/写给脖子上的菩萨.md";
  slug: "short/1985/写给脖子上的菩萨";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/北方门前.md": {
	id: "short/1985/北方门前.md";
  slug: "short/1985/北方门前";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/十四行-夜晚的月亮.md": {
	id: "short/1985/十四行-夜晚的月亮.md";
  slug: "short/1985/十四行-夜晚的月亮";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/夏天的太阳.md": {
	id: "short/1985/夏天的太阳.md";
  slug: "short/1985/夏天的太阳";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/夜月.md": {
	id: "short/1985/夜月.md";
  slug: "short/1985/夜月";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/孤独的东方人.md": {
	id: "short/1985/孤独的东方人.md";
  slug: "short/1985/孤独的东方人";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/得不到你.md": {
	id: "short/1985/得不到你.md";
  slug: "short/1985/得不到你";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/我请求-雨.md": {
	id: "short/1985/我请求-雨.md";
  slug: "short/1985/我请求-雨";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/打钟.md": {
	id: "short/1985/打钟.md";
  slug: "short/1985/打钟";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/早祷与枭.md": {
	id: "short/1985/早祷与枭.md";
  slug: "short/1985/早祷与枭";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/明天醒来我会在哪一只鞋子里.md": {
	id: "short/1985/明天醒来我会在哪一只鞋子里.md";
  slug: "short/1985/明天醒来我会在哪一只鞋子里";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/活在珍贵的人间.md": {
	id: "short/1985/活在珍贵的人间.md";
  slug: "short/1985/活在珍贵的人间";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/熟了麦子.md": {
	id: "short/1985/熟了麦子.md";
  slug: "short/1985/熟了麦子";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/船尾之梦.md": {
	id: "short/1985/船尾之梦.md";
  slug: "short/1985/船尾之梦";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/莲界慈航.md": {
	id: "short/1985/莲界慈航.md";
  slug: "short/1985/莲界慈航";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/蓝姬的巢.md": {
	id: "short/1985/蓝姬的巢.md";
  slug: "short/1985/蓝姬的巢";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1985/麦地.md": {
	id: "short/1985/麦地.md";
  slug: "short/1985/麦地";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/云朵.md": {
	id: "short/1986/云朵.md";
  slug: "short/1986/云朵";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/从六月到十月.md": {
	id: "short/1986/从六月到十月.md";
  slug: "short/1986/从六月到十月";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/八月尾.md": {
	id: "short/1986/八月尾.md";
  slug: "short/1986/八月尾";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/哭泣.md": {
	id: "short/1986/哭泣.md";
  slug: "short/1986/哭泣";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/坐在纸箱上想起疯了的朋友们.md": {
	id: "short/1986/坐在纸箱上想起疯了的朋友们.md";
  slug: "short/1986/坐在纸箱上想起疯了的朋友们";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/我感到魅惑.md": {
	id: "short/1986/我感到魅惑.md";
  slug: "short/1986/我感到魅惑";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/梭罗这人有脑子.md": {
	id: "short/1986/梭罗这人有脑子.md";
  slug: "short/1986/梭罗这人有脑子";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/海子小夜曲.md": {
	id: "short/1986/海子小夜曲.md";
  slug: "short/1986/海子小夜曲";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/给B的生日.md": {
	id: "short/1986/给B的生日.md";
  slug: "short/1986/给b的生日";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/给你.md": {
	id: "short/1986/给你.md";
  slug: "short/1986/给你";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/给卡夫卡.md": {
	id: "short/1986/给卡夫卡.md";
  slug: "short/1986/给卡夫卡";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/给托尔斯泰.md": {
	id: "short/1986/给托尔斯泰.md";
  slug: "short/1986/给托尔斯泰";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/肉体（之一）.md": {
	id: "short/1986/肉体（之一）.md";
  slug: "short/1986/肉体之一";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/葡萄园之西的话语.md": {
	id: "short/1986/葡萄园之西的话语.md";
  slug: "short/1986/葡萄园之西的话语";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/让我把脚丫搁在黄昏中一位木匠的工具箱上.md": {
	id: "short/1986/让我把脚丫搁在黄昏中一位木匠的工具箱上.md";
  slug: "short/1986/让我把脚丫搁在黄昏中一位木匠的工具箱上";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/诗人叶赛宁（组诗）.md": {
	id: "short/1986/诗人叶赛宁（组诗）.md";
  slug: "short/1986/诗人叶赛宁组诗";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/诗集.md": {
	id: "short/1986/诗集.md";
  slug: "short/1986/诗集";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/谣曲.md": {
	id: "short/1986/谣曲.md";
  slug: "short/1986/谣曲";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1986/黎明.md": {
	id: "short/1986/黎明.md";
  slug: "short/1986/黎明";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/不幸_1.md": {
	id: "short/1987/不幸_1.md";
  slug: "short/1987/不幸_1";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/两行诗.md": {
	id: "short/1987/两行诗.md";
  slug: "short/1987/两行诗";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/为什么你不生活在沙漠上.md": {
	id: "short/1987/为什么你不生活在沙漠上.md";
  slug: "short/1987/为什么你不生活在沙漠上";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/九寨之星.md": {
	id: "short/1987/九寨之星.md";
  slug: "short/1987/九寨之星";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/九首诗的村庄.md": {
	id: "short/1987/九首诗的村庄.md";
  slug: "short/1987/九首诗的村庄";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/五月的麦地.md": {
	id: "short/1987/五月的麦地.md";
  slug: "short/1987/五月的麦地";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/但丁来到此时此地.md": {
	id: "short/1987/但丁来到此时此地.md";
  slug: "short/1987/但丁来到此时此地";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/光棍.md": {
	id: "short/1987/光棍.md";
  slug: "short/1987/光棍";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/八月 黑色的火把.md": {
	id: "short/1987/八月 黑色的火把.md";
  slug: "short/1987/八月-黑色的火把";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/八月之杯.md": {
	id: "short/1987/八月之杯.md";
  slug: "short/1987/八月之杯";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/公爵的私生女.md": {
	id: "short/1987/公爵的私生女.md";
  slug: "short/1987/公爵的私生女";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/冬天.md": {
	id: "short/1987/冬天.md";
  slug: "short/1987/冬天";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/冬天的雨.md": {
	id: "short/1987/冬天的雨.md";
  slug: "short/1987/冬天的雨";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/北方的树林.md": {
	id: "short/1987/北方的树林.md";
  slug: "short/1987/北方的树林";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/十四行-王冠.md": {
	id: "short/1987/十四行-王冠.md";
  slug: "short/1987/十四行-王冠";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/十四行-玫瑰花.md": {
	id: "short/1987/十四行-玫瑰花.md";
  slug: "short/1987/十四行-玫瑰花";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/十四行-玫瑰花园.md": {
	id: "short/1987/十四行-玫瑰花园.md";
  slug: "short/1987/十四行-玫瑰花园";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/吊半坡并给擅入都市的农民.md": {
	id: "short/1987/吊半坡并给擅入都市的农民.md";
  slug: "short/1987/吊半坡并给擅入都市的农民";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/四行诗.md": {
	id: "short/1987/四行诗.md";
  slug: "short/1987/四行诗";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/土地·忧郁·死亡.md": {
	id: "short/1987/土地·忧郁·死亡.md";
  slug: "short/1987/土地忧郁死亡";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/在大草原上预感到海的降临.md": {
	id: "short/1987/在大草原上预感到海的降临.md";
  slug: "short/1987/在大草原上预感到海的降临";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/在家乡.md": {
	id: "short/1987/在家乡.md";
  slug: "short/1987/在家乡";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/夜晚 亲爱的朋友.md": {
	id: "short/1987/夜晚 亲爱的朋友.md";
  slug: "short/1987/夜晚-亲爱的朋友";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/太平洋上的贾宝玉.md": {
	id: "short/1987/太平洋上的贾宝玉.md";
  slug: "short/1987/太平洋上的贾宝玉";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/尼采，你使我想起悲伤的热带.md": {
	id: "short/1987/尼采，你使我想起悲伤的热带.md";
  slug: "short/1987/尼采你使我想起悲伤的热带";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/幸福的一日.md": {
	id: "short/1987/幸福的一日.md";
  slug: "short/1987/幸福的一日";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/日出.md": {
	id: "short/1987/日出.md";
  slug: "short/1987/日出";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/昌平柿子树.md": {
	id: "short/1987/昌平柿子树.md";
  slug: "short/1987/昌平柿子树";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/晨雨时光.md": {
	id: "short/1987/晨雨时光.md";
  slug: "short/1987/晨雨时光";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/月光.md": {
	id: "short/1987/月光.md";
  slug: "short/1987/月光";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/枫.md": {
	id: "short/1987/枫.md";
  slug: "short/1987/枫";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/水抱屈原.md": {
	id: "short/1987/水抱屈原.md";
  slug: "short/1987/水抱屈原";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/汉俳.md": {
	id: "short/1987/汉俳.md";
  slug: "short/1987/汉俳";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/灯.md": {
	id: "short/1987/灯.md";
  slug: "short/1987/灯";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/灯诗.md": {
	id: "short/1987/灯诗.md";
  slug: "short/1987/灯诗";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/献诗.md": {
	id: "short/1987/献诗.md";
  slug: "short/1987/献诗";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/献诗_2.md": {
	id: "short/1987/献诗_2.md";
  slug: "short/1987/献诗_2";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/生殖.md": {
	id: "short/1987/生殖.md";
  slug: "short/1987/生殖";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/病少女.md": {
	id: "short/1987/病少女.md";
  slug: "short/1987/病少女";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/盲目.md": {
	id: "short/1987/盲目.md";
  slug: "short/1987/盲目";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/盲目_1.md": {
	id: "short/1987/盲目_1.md";
  slug: "short/1987/盲目_1";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/石头的病或八七年.md": {
	id: "short/1987/石头的病或八七年.md";
  slug: "short/1987/石头的病或八七年";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/祖国（或以梦为马）.md": {
	id: "short/1987/祖国（或以梦为马）.md";
  slug: "short/1987/祖国或以梦为马";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/秋.md": {
	id: "short/1987/秋.md";
  slug: "short/1987/秋";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/秋_1.md": {
	id: "short/1987/秋_1.md";
  slug: "short/1987/秋_1";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/秋天_1.md": {
	id: "short/1987/秋天_1.md";
  slug: "short/1987/秋天_1";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/秋天的祖国.md": {
	id: "short/1987/秋天的祖国.md";
  slug: "short/1987/秋天的祖国";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/秋日山谷.md": {
	id: "short/1987/秋日山谷.md";
  slug: "short/1987/秋日山谷";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/秋日想起春天的痛苦也想起雷锋.md": {
	id: "short/1987/秋日想起春天的痛苦也想起雷锋.md";
  slug: "short/1987/秋日想起春天的痛苦也想起雷锋";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/秋日黄昏.md": {
	id: "short/1987/秋日黄昏.md";
  slug: "short/1987/秋日黄昏";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/粮食两节.md": {
	id: "short/1987/粮食两节.md";
  slug: "short/1987/粮食两节";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/给伦敦.md": {
	id: "short/1987/给伦敦.md";
  slug: "short/1987/给伦敦";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/给安庆.md": {
	id: "short/1987/给安庆.md";
  slug: "short/1987/给安庆";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/美丽白杨树.md": {
	id: "short/1987/美丽白杨树.md";
  slug: "short/1987/美丽白杨树";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/耶稣.md": {
	id: "short/1987/耶稣.md";
  slug: "short/1987/耶稣";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/酒杯-情诗一束.md": {
	id: "short/1987/酒杯-情诗一束.md";
  slug: "short/1987/酒杯-情诗一束";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/酒杯.md": {
	id: "short/1987/酒杯.md";
  slug: "short/1987/酒杯";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/重建家园.md": {
	id: "short/1987/重建家园.md";
  slug: "short/1987/重建家园";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/野花.md": {
	id: "short/1987/野花.md";
  slug: "short/1987/野花";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/长发飞舞的姑娘.md": {
	id: "short/1987/长发飞舞的姑娘.md";
  slug: "short/1987/长发飞舞的姑娘";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/雨.md": {
	id: "short/1987/雨.md";
  slug: "short/1987/雨";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/雨鞋.md": {
	id: "short/1987/雨鞋.md";
  slug: "short/1987/雨鞋";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/马、火、灰——鼎.md": {
	id: "short/1987/马、火、灰——鼎.md";
  slug: "short/1987/马火灰鼎";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/马雅可夫斯基自传.md": {
	id: "short/1987/马雅可夫斯基自传.md";
  slug: "short/1987/马雅可夫斯基自传";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/麦地 或遥远.md": {
	id: "short/1987/麦地 或遥远.md";
  slug: "short/1987/麦地-或遥远";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/麦地与诗人.md": {
	id: "short/1987/麦地与诗人.md";
  slug: "short/1987/麦地与诗人";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/黎明-一首小诗.md": {
	id: "short/1987/黎明-一首小诗.md";
  slug: "short/1987/黎明-一首小诗";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1987/黎明和黄昏.md": {
	id: "short/1987/黎明和黄昏.md";
  slug: "short/1987/黎明和黄昏";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/七百年前.md": {
	id: "short/1988/七百年前.md";
  slug: "short/1988/七百年前";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/乳房.md": {
	id: "short/1988/乳房.md";
  slug: "short/1988/乳房";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/在一个阿拉伯沙漠的村镇上.md": {
	id: "short/1988/在一个阿拉伯沙漠的村镇上.md";
  slug: "short/1988/在一个阿拉伯沙漠的村镇上";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/夜色.md": {
	id: "short/1988/夜色.md";
  slug: "short/1988/夜色";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/大草原 大雪封山.md": {
	id: "short/1988/大草原 大雪封山.md";
  slug: "short/1988/大草原-大雪封山";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/大风.md": {
	id: "short/1988/大风.md";
  slug: "short/1988/大风";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/太阳和野花.md": {
	id: "short/1988/太阳和野花.md";
  slug: "short/1988/太阳和野花";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/山楂树.md": {
	id: "short/1988/山楂树.md";
  slug: "short/1988/山楂树";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/我飞遍草原的天空.md": {
	id: "short/1988/我飞遍草原的天空.md";
  slug: "short/1988/我飞遍草原的天空";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/无名的野花.md": {
	id: "short/1988/无名的野花.md";
  slug: "short/1988/无名的野花";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/日记.md": {
	id: "short/1988/日记.md";
  slug: "short/1988/日记";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/星.md": {
	id: "short/1988/星.md";
  slug: "short/1988/星";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/桃花.md": {
	id: "short/1988/桃花.md";
  slug: "short/1988/桃花";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/海底卧室.md": {
	id: "short/1988/海底卧室.md";
  slug: "short/1988/海底卧室";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/生日.md": {
	id: "short/1988/生日.md";
  slug: "short/1988/生日";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/眺望北方.md": {
	id: "short/1988/眺望北方.md";
  slug: "short/1988/眺望北方";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/绿松石.md": {
	id: "short/1988/绿松石.md";
  slug: "short/1988/绿松石";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/花儿为什么这样红.md": {
	id: "short/1988/花儿为什么这样红.md";
  slug: "short/1988/花儿为什么这样红";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/西藏.md": {
	id: "short/1988/西藏.md";
  slug: "short/1988/西藏";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/跳伞塔.md": {
	id: "short/1988/跳伞塔.md";
  slug: "short/1988/跳伞塔";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/远方.md": {
	id: "short/1988/远方.md";
  slug: "short/1988/远方";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/远方_1.md": {
	id: "short/1988/远方_1.md";
  slug: "short/1988/远方_1";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/野鸽子.md": {
	id: "short/1988/野鸽子.md";
  slug: "short/1988/野鸽子";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/雪.md": {
	id: "short/1988/雪.md";
  slug: "short/1988/雪";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/青海湖.md": {
	id: "short/1988/青海湖.md";
  slug: "short/1988/青海湖";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1988/黑翅膀.md": {
	id: "short/1988/黑翅膀.md";
  slug: "short/1988/黑翅膀";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/你和桃花.md": {
	id: "short/1989/你和桃花.md";
  slug: "short/1989/你和桃花";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/叙事诗.md": {
	id: "short/1989/叙事诗.md";
  slug: "short/1989/叙事诗";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/四姐妹.md": {
	id: "short/1989/四姐妹.md";
  slug: "short/1989/四姐妹";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/太平洋的献诗.md": {
	id: "short/1989/太平洋的献诗.md";
  slug: "short/1989/太平洋的献诗";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/折梅.md": {
	id: "short/1989/折梅.md";
  slug: "short/1989/折梅";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/拂晓.md": {
	id: "short/1989/拂晓.md";
  slug: "short/1989/拂晓";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/日落时分的部落.md": {
	id: "short/1989/日落时分的部落.md";
  slug: "short/1989/日落时分的部落";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/春天_1.md": {
	id: "short/1989/春天_1.md";
  slug: "short/1989/春天_1";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/春天，十个海子.md": {
	id: "short/1989/春天，十个海子.md";
  slug: "short/1989/春天十个海子";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/最后一夜和第一日的献诗.md": {
	id: "short/1989/最后一夜和第一日的献诗.md";
  slug: "short/1989/最后一夜和第一日的献诗";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/月全食.md": {
	id: "short/1989/月全食.md";
  slug: "short/1989/月全食";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/桃树林.md": {
	id: "short/1989/桃树林.md";
  slug: "short/1989/桃树林";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/桃花_1.md": {
	id: "short/1989/桃花_1.md";
  slug: "short/1989/桃花_1";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/桃花开放.md": {
	id: "short/1989/桃花开放.md";
  slug: "short/1989/桃花开放";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/桃花时节.md": {
	id: "short/1989/桃花时节.md";
  slug: "short/1989/桃花时节";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/献给太平洋.md": {
	id: "short/1989/献给太平洋.md";
  slug: "short/1989/献给太平洋";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/献诗_1.md": {
	id: "short/1989/献诗_1.md";
  slug: "short/1989/献诗_1";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/神秘的二月的时光.md": {
	id: "short/1989/神秘的二月的时光.md";
  slug: "short/1989/神秘的二月的时光";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/遥远的路程.md": {
	id: "short/1989/遥远的路程.md";
  slug: "short/1989/遥远的路程";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/遥远的路程_1.md": {
	id: "short/1989/遥远的路程_1.md";
  slug: "short/1989/遥远的路程_1";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/面朝大海，春暖花开.md": {
	id: "short/1989/面朝大海，春暖花开.md";
  slug: "short/1989/面朝大海春暖花开";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/黎明（之一）.md": {
	id: "short/1989/黎明（之一）.md";
  slug: "short/1989/黎明之一";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/黎明（之三）.md": {
	id: "short/1989/黎明（之三）.md";
  slug: "short/1989/黎明之三";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/黎明（之二）.md": {
	id: "short/1989/黎明（之二）.md";
  slug: "short/1989/黎明之二";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"short/1989/黑夜的献诗.md": {
	id: "short/1989/黑夜的献诗.md";
  slug: "short/1989/黑夜的献诗";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"sun/太阳·土地篇.md": {
	id: "sun/太阳·土地篇.md";
  slug: "sun/太阳土地篇";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"sun/太阳·大札撒（残稿）.md": {
	id: "sun/太阳·大札撒（残稿）.md";
  slug: "sun/太阳大札撒残稿";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"sun/太阳·弑.md": {
	id: "sun/太阳·弑.md";
  slug: "sun/太阳弑";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"sun/太阳·弥赛亚.md": {
	id: "sun/太阳·弥赛亚.md";
  slug: "sun/太阳弥赛亚";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"sun/太阳·断头篇.md": {
	id: "sun/太阳·断头篇.md";
  slug: "sun/太阳断头篇";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"sun/太阳·诗剧.md": {
	id: "sun/太阳·诗剧.md";
  slug: "sun/太阳诗剧";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
"sun/太阳，你是父亲的好女儿.md": {
	id: "sun/太阳，你是父亲的好女儿.md";
  slug: "sun/太阳你是父亲的好女儿";
  body: string;
  collection: "poems";
  data: any
} & { render(): Render[".md"] };
};
"timeline": {
"1964.md": {
	id: "1964.md";
  slug: "1964";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
"1969.md": {
	id: "1969.md";
  slug: "1969";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
"1973.md": {
	id: "1973.md";
  slug: "1973";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
"1979.md": {
	id: "1979.md";
  slug: "1979";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
"1980.md": {
	id: "1980.md";
  slug: "1980";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
"1981.md": {
	id: "1981.md";
  slug: "1981";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
"1982.md": {
	id: "1982.md";
  slug: "1982";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
"1983.md": {
	id: "1983.md";
  slug: "1983";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
"1984.md": {
	id: "1984.md";
  slug: "1984";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
"1985.md": {
	id: "1985.md";
  slug: "1985";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
"1986.md": {
	id: "1986.md";
  slug: "1986";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
"1987.md": {
	id: "1987.md";
  slug: "1987";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
"1988.md": {
	id: "1988.md";
  slug: "1988";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
"1989.md": {
	id: "1989.md";
  slug: "1989";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
"1990.md": {
	id: "1990.md";
  slug: "1990";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
"1991.md": {
	id: "1991.md";
  slug: "1991";
  body: string;
  collection: "timeline";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"_config": Record<string, {
  id: string;
  collection: "_config";
  data: any;
}>;

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
