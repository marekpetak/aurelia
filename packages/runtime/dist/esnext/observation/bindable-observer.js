var BindableObserver_1;
import { __decorate, __metadata } from "tslib";
import { Reporter, PLATFORM } from '@aurelia/kernel';
import { ILifecycle } from '../lifecycle';
import { ProxyObserver } from './proxy-observer';
import { subscriberCollection } from './subscriber-collection';
let BindableObserver = BindableObserver_1 = class BindableObserver {
    constructor(lifecycle, flags, obj, propertyKey, cbName, $set) {
        this.lifecycle = lifecycle;
        this.obj = obj;
        this.propertyKey = propertyKey;
        this.$set = $set;
        this.currentValue = void 0;
        this.oldValue = void 0;
        this.inBatch = false;
        let isProxy = false;
        if (ProxyObserver.isProxy(obj)) {
            isProxy = true;
            obj.$observer.subscribe(this, propertyKey);
            this.obj = obj.$raw;
        }
        this.callback = this.obj[cbName];
        const propertyChangedCallback = this.propertyChangedCallback = this.obj.propertyChanged;
        const hasPropertyChangedCallback = this.hasPropertyChangedCallback = typeof propertyChangedCallback === 'function';
        const shouldInterceptSet = this.shouldInterceptSet = $set !== PLATFORM.noop;
        // when user declare @bindable({ set })
        // it's expected to work from the start,
        // regardless where the assignment comes from: either direct view model assignment or from binding during render
        // so if either getter/setter config is present, alter the accessor straight await
        if (this.callback === void 0 && !hasPropertyChangedCallback && !shouldInterceptSet) {
            this.observing = false;
        }
        else {
            this.observing = true;
            const currentValue = obj[propertyKey];
            this.currentValue = shouldInterceptSet
                ? currentValue
                : $set(currentValue);
            if (!isProxy) {
                this.createGetterSetter();
            }
        }
        this.persistentFlags = flags & 2080374799 /* persistentBindingFlags */;
    }
    handleChange(newValue, oldValue, flags) {
        this.setValue(newValue, flags);
    }
    getValue() {
        return this.currentValue;
    }
    setValue(newValue, flags) {
        if (this.shouldInterceptSet) {
            newValue = this.$set(newValue);
        }
        if (this.observing) {
            const currentValue = this.currentValue;
            // eslint-disable-next-line compat/compat
            if (Object.is(newValue, currentValue)) {
                return;
            }
            this.currentValue = newValue;
            if (this.lifecycle.batch.depth === 0) {
                this.callSubscribers(newValue, currentValue, this.persistentFlags | flags);
                if ((flags & 4096 /* fromBind */) === 0 || (flags & 32 /* updateSourceExpression */) > 0) {
                    const callback = this.callback;
                    if (callback !== void 0) {
                        callback.call(this.obj, newValue, currentValue, this.persistentFlags | flags);
                    }
                    if (this.hasPropertyChangedCallback) {
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                        this.propertyChangedCallback.call(this.obj, this.propertyKey, newValue, currentValue, this.persistentFlags | flags);
                    }
                }
            }
            else if (!this.inBatch) {
                this.inBatch = true;
                this.oldValue = currentValue;
                this.lifecycle.batch.add(this);
            }
        }
        else {
            // See SetterObserver.setValue for explanation
            this.obj[this.propertyKey] = newValue;
        }
    }
    subscribe(subscriber) {
        if (this.observing === false) {
            this.observing = true;
            const currentValue = this.obj[this.propertyKey];
            this.currentValue = this.shouldInterceptSet
                ? this.$set(currentValue)
                : currentValue;
            this.createGetterSetter();
        }
        this.addSubscriber(subscriber);
    }
    createGetterSetter() {
        if (!Reflect.defineProperty(this.obj, this.propertyKey, {
            enumerable: true,
            configurable: true,
            get: () => this.currentValue,
            set: (value) => {
                this.setValue(value, 0 /* none */);
            }
        })) {
            Reporter.write(1, this.propertyKey, this.obj);
        }
    }
};
BindableObserver = BindableObserver_1 = __decorate([
    subscriberCollection(),
    __metadata("design:paramtypes", [Object, Number, Object, String, String, Function])
], BindableObserver);
export { BindableObserver };
//# sourceMappingURL=bindable-observer.js.map