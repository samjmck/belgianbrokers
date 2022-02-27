import { Money } from "./Money";
import { getMessage, getTemplate, Language, Locale, TemplateValues } from "./i18n/language";

export class Fee {

    constructor(
       public value: Money,
       public typeKey: string,
       public calculationDescriptionKey: string,
       public calculationDescriptionValues: TemplateValues,
    ) {}

    getType(language: Language) {
        return getMessage(language, this.typeKey);
    }

    getCalculationDescription(locale: Locale, capitalize = true) {
        return getTemplate(locale, this.calculationDescriptionKey, capitalize, ...this.calculationDescriptionValues);
    }

}
