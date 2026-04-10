import Event from "sap/ui/base/Event";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./ProductRating" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ProductRatingSettings extends $ControlSettings {
        value?: number | PropertyBindingInfo | `{${string}}`;
        change?: (event: ProductRating$ChangeEvent) => void;
    }

    export default interface ProductRating {

        // property: value
        getValue(): number;
        setValue(value: number): this;

        // event: change
        attachChange(fn: (event: ProductRating$ChangeEvent) => void, listener?: object): this;
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: ProductRating$ChangeEvent, data: CustomDataType) => void, listener?: object): this;
        detachChange(fn: (event: ProductRating$ChangeEvent) => void, listener?: object): this;
        fireChange(parameters?: ProductRating$ChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of ProductRating's 'change' event.
     */
    export interface ProductRating$ChangeEventParameters {
        value?: number;
    }

    /**
     * Type describing the ProductRating's 'change' event.
     */
    export type ProductRating$ChangeEvent = Event<ProductRating$ChangeEventParameters>;
}
