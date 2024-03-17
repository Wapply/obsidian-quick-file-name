import { App, Plugin, Notice, PluginSettingTab, Setting, addIcon, TFile } from 'obsidian';
import { RandomNoteNameGeneratorSettings, RandomNoteNameGeneratorSettingTab, DEFAULT_SETTINGS } from './settings';

export default class RandomNoteNameGenerator extends Plugin {
    settings: RandomNoteNameGeneratorSettings;
    commandId: string;

    async onload() {
        await this.loadSettings();

        this.commandId = 'generate-random-note-name';
        this.addCommand({
            id: this.commandId,
            name: 'Generate Random Note Name',
            hotkeys: [{ modifiers: ['Ctrl'], key: 'r' }],
            callback: () => this.generateRandomNoteName(),
        });

        this.addSettingTab(new RandomNoteNameGeneratorSettingTab(this.app, this));

        // Add custom icon
        addIcon('new-random-note', `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>
            </svg>
        `);
        
        // Add the icon button to the ribbon
        this.addRibbonIcon('infinity', 'New Random Note', () => {
            this.generateRandomNoteName();
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async generateRandomNoteName() {
        const randomString = this.generateRandomString();
    
        try {
            const file = await this.app.vault.create(randomString + '.md', '');
            const leaf = this.app.workspace.getLeaf();
            await leaf.openFile(file); // Open the newly created note
            new Notice(`Opened new note: ${randomString}.md`);
        } catch (error) {
            new Notice(`Error opening new note: ${error.message}`);
        }
    }
    

    generateRandomString(): string {
        const { length, useUppercase, useLowercase, useNumbers, useSymbols } = this.settings;
        let result = '';
        const chars = useUppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '';
        const chars2 = useLowercase ? 'abcdefghijklmnopqrstuvwxyz' : '';
        const numbers = useNumbers ? '0123456789' : '';
        const symbols = useSymbols ? '!@#$%^&()-_[]{}+=' : '';
        const charSet = chars + chars2 + numbers + symbols;

        for (let i = 0; i < length; i++) {
            result += charSet.charAt(Math.floor(Math.random() * charSet.length));
        }

        return result;
    }
}