import {
    Event,
    EVENT_DISABLE,
    EVENT_ENABLE,
    IEnable
} from "../api";
import { mixin } from "../mixin";

interface _IEnable extends IEnable<any> {
    _enabled: boolean;
    notify?(e: Event): void;
}

/**
 * Mixin class decorator, injects IEnable default implementation, incl.
 * a `_enabled` property. If the target also implements the `INotify`
 * interface, `enable()` and `disable()` will automatically emit the
 * respective events.
 */
export const IEnableMixin = mixin(<IEnable<any>>{
    _enabled: true,

    isEnabled() {
        return (<_IEnable>this)._enabled;
    },

    enable() {
        const $this = <_IEnable>this;
        $this._enabled = true;
        if ($this.notify) {
            $this.notify({ id: EVENT_ENABLE, target: this });
        }
    },

    disable() {
        const $this = <_IEnable>this;
        $this._enabled = false;
        if ($this.notify) {
            $this.notify({ id: EVENT_DISABLE, target: this });
        }
    },

    toggle() {
        (<_IEnable>this)._enabled ? this.disable() : this.enable();
        return (<_IEnable>this)._enabled;
    }
});
