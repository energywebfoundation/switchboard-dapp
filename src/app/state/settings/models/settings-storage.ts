const TOGGLE_EXPERIMENTAL = 'ExperimentalFeatures';

export class SettingsStorage {
  static toggleExperimental(value: string) {
    localStorage.setItem(TOGGLE_EXPERIMENTAL, value);
  }

  static isExperimentalEnabled() {
    return localStorage.getItem(TOGGLE_EXPERIMENTAL) === 'true';
  }
}
