import { useBeity } from '../store/BeityContext.jsx'
import {
  t as translate,
  tr as translateField,
  trList as translateList,
  withCurrency,
  label,
  formatDate,
} from './translations.js'

/**
 * Convenience hook: pulls the current language out of the store and returns
 * translator functions already bound to it, so components don't have to pass
 * `lang` around everywhere.
 */
export function useLang() {
  const { lang, setLang } = useBeity()

  return {
    lang,
    setLang,
    toggleLang: () => setLang(lang === 'ar' ? 'en' : 'ar'),
    t: (key) => translate(key, lang),
    tr: (field) => translateField(field, lang),
    trList: (list) => translateList(list, lang),
    withCurrency: (str) => withCurrency(str, lang),
    label: (map, key) => label(map, key, lang),
    fmtDate: (value) => formatDate(value, lang),
  }
}
