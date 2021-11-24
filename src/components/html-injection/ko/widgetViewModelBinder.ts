import { Bag } from "@paperbits/common";
import { EventManager, Events } from "@paperbits/common/events";
import { IWidgetBinding } from "@paperbits/common/editing";
import { widgetName, widgetDisplayName, widgetEditorSelector } from "../constants";
import { WidgetViewModel } from "./widgetViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { HTMLInjectionWidgetModel } from "../widgetModel";

/**
 * This class describes how the model needs to be presented (as a view model)
 * in a specific UI framework.
 */
export class WidgetViewModelBinder implements ViewModelBinder<HTMLInjectionWidgetModel, WidgetViewModel>  {
    constructor(private readonly eventManager: EventManager) { }

    public async updateViewModel(model: HTMLInjectionWidgetModel, viewModel: WidgetViewModel): Promise<void> {
        viewModel.runtimeConfig(JSON.stringify({
            htmlCode: model.htmlCode,
            htmlCodeSizeStyles: model.htmlCodeSizeStyles,
        }));
    }

    public async modelToViewModel(model: HTMLInjectionWidgetModel, viewModel?: WidgetViewModel, bindingContext?: Bag<any>): Promise<WidgetViewModel> {
        if (!viewModel) {
            viewModel = new WidgetViewModel();

            const binding: IWidgetBinding<HTMLInjectionWidgetModel, WidgetViewModel> = {
                name: widgetName,
                displayName: widgetDisplayName,
                readonly: bindingContext ? bindingContext.readonly : false,
                model: model,
                flow: "block",
                editor: widgetEditorSelector,
                draggable: true,
                applyChanges: async () => {
                    await this.updateViewModel(model, viewModel);
                    this.eventManager.dispatchEvent(Events.ContentUpdate);
                }
            };

            viewModel["widgetBinding"] = binding;
        }

        this.updateViewModel(model, viewModel);

        return viewModel;
    }

    public canHandleModel(model: HTMLInjectionWidgetModel): boolean {
        return model instanceof HTMLInjectionWidgetModel;
    }
}