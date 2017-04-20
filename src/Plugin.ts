export interface TLD {
	name: string;
	mount: string;
	icon?: string;
	details?: Map<string, string>;
}
export interface DirContent {
	dirs: string[];
	files: string[];
}
export interface VoyagerPlugin {
	pluginName: string;
	pluginIcon?: string;
	getTLDs(): Promise<TLD[]>;
	getDirContents(dir: string): Promise<DirContent>;
	openFile(path: string): any;
}
