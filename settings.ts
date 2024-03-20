import { App, PluginSettingTab, Setting, TextComponent } from 'obsidian';
import RandomNoteNameGenerator from './main';

export interface RandomNoteNameGeneratorSettings {
    length: number;
    useUppercase: boolean;
    useLowercase: boolean;
    useNumbers: boolean;
    useSymbols: boolean;
    useHotkey: boolean; // New setting to control hotkey usage
    hotkey: string; // New setting to define custom hotkey
}

export const DEFAULT_SETTINGS: RandomNoteNameGeneratorSettings = {
    length: 8,
    useUppercase: true,
    useLowercase: false,
    useNumbers: true,
    useSymbols: false,
    useHotkey: false, // Default to not using hotkey
    hotkey: 'Ctrl+R', // Default hotkey, can be customized by the user
};

export class RandomNoteNameGeneratorSettingTab extends PluginSettingTab {
    plugin: RandomNoteNameGenerator;
    hotkeyInput: HTMLInputElement;

    constructor(app: App, plugin: RandomNoteNameGenerator) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Length')
            .setDesc('Number of characters in the random string')
            .addText((text) =>
                text
                    .setPlaceholder('Length')
                    .setValue(this.plugin.settings.length.toString())
                    .onChange(async (value) => {
                        this.plugin.settings.length = parseInt(value, 10);
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Use Uppercase')
            .setDesc('Include uppercase letters in the random string')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.useUppercase)
                    .onChange(async (value) => {
                        this.plugin.settings.useUppercase = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Use Lowercase')
            .setDesc('Include lowercase letters in the random string')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.useLowercase)
                    .onChange(async (value) => {
                        this.plugin.settings.useLowercase = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Use Numbers')
            .setDesc('Include numbers in the random string')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.useNumbers)
                    .onChange(async (value) => {
                        this.plugin.settings.useNumbers = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Use Symbols')
            .setDesc('Include symbols in the random string')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.useSymbols)
                    .onChange(async (value) => {
                        this.plugin.settings.useSymbols = value;
                        await this.plugin.saveSettings();
                    })
            );
            new Setting(containerEl)
            .setName('Use Hotkey')
            .setDesc('Enable hotkey for generating random note names')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.useHotkey)
                    .onChange(async (value) => {
                        this.plugin.settings.useHotkey = value;
                        await this.plugin.saveSettings();
                        this.toggleHotkeyInput(value);
                    })
            );

        const hotkeySetting = new Setting(containerEl)
            .setName('Hotkey')
            .setDesc('Define a custom hotkey for generating random note names');

        this.hotkeyInput = hotkeySetting
            .addText((text) => {
                text.inputEl.placeholder = 'Press a key combination...';
                text.inputEl.value = this.plugin.settings.hotkey;
                text.inputEl.readOnly = !this.plugin.settings.useHotkey;
                text.inputEl.addEventListener('focus', () => {
                    text.inputEl.value = '';
                    text.inputEl.readOnly = false;
                    text.inputEl.focus();
                });
                text.inputEl.addEventListener('keydown', (event) => {
                    const { key, ctrlKey, shiftKey, altKey, metaKey } = event;
                    const modifiers = [];
                    if (ctrlKey) modifiers.push('Ctrl');
                    if (shiftKey) modifiers.push('Shift');
                    if (altKey) modifiers.push('Alt');
                    if (metaKey) modifiers.push('Cmd');
                    const hotkey = [...modifiers, key].join('+');
                    text.inputEl.value = hotkey;
                    this.plugin.settings.hotkey = hotkey;
                    this.plugin.saveSettings();
                    event.preventDefault(); // Prevent the browser's default behavior
                    event.stopPropagation(); // Stop the event from propagating
                });
                return text;
            })
            .descEl.querySelector('input') as HTMLInputElement;

        this.toggleHotkeyInput(this.plugin.settings.useHotkey);
    }

    toggleHotkeyInput(enabled: boolean): void {
        this.hotkeyInput.readOnly = !enabled;
    }
}