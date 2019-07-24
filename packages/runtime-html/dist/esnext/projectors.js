import { PLATFORM, Registration, Reporter, toArray } from '@aurelia/kernel';
import { IProjectorLocator } from '@aurelia/runtime';
const slice = Array.prototype.slice;
const defaultShadowOptions = {
    mode: 'open'
};
export class HTMLProjectorLocator {
    static register(container) {
        return Registration.singleton(IProjectorLocator, this).register(container);
    }
    getElementProjector(dom, $component, host, def) {
        if (def.shadowOptions || def.hasSlots) {
            if (def.containerless) {
                throw Reporter.error(21);
            }
            return new ShadowDOMProjector(dom, $component, host, def);
        }
        if (def.containerless) {
            return new ContainerlessProjector(dom, $component, host);
        }
        return new HostProjector($component, host);
    }
}
const childObserverOptions = { childList: true };
/** @internal */
export class ShadowDOMProjector {
    constructor(dom, $controller, host, definition) {
        this.dom = dom;
        this.host = host;
        let shadowOptions;
        if (definition.shadowOptions instanceof Object &&
            'mode' in definition.shadowOptions) {
            shadowOptions = definition.shadowOptions;
        }
        else {
            shadowOptions = defaultShadowOptions;
        }
        this.shadowRoot = host.attachShadow(shadowOptions);
        this.host.$controller = $controller;
        this.shadowRoot.$controller = $controller;
    }
    get children() {
        return this.shadowRoot.childNodes;
    }
    subscribeToChildrenChange(callback) {
        // TODO: add a way to dispose/disconnect
        this.dom.createNodeObserver(this.shadowRoot, callback, childObserverOptions);
    }
    provideEncapsulationSource() {
        return this.shadowRoot;
    }
    project(nodes) {
        nodes.appendTo(this.shadowRoot);
    }
    take(nodes) {
        nodes.remove();
        nodes.unlink();
    }
}
/** @internal */
export class ContainerlessProjector {
    constructor(dom, $controller, host) {
        if (host.childNodes.length) {
            this.childNodes = toArray(host.childNodes);
        }
        else {
            this.childNodes = PLATFORM.emptyArray;
        }
        this.host = dom.convertToRenderLocation(host);
        this.host.$controller = $controller;
    }
    get children() {
        return this.childNodes;
    }
    subscribeToChildrenChange(callback) {
        // TODO: add a way to dispose/disconnect
        const observer = new MutationObserver(callback);
        observer.observe(this.host, childObserverOptions);
    }
    provideEncapsulationSource() {
        return this.host.getRootNode();
    }
    project(nodes) {
        nodes.insertBefore(this.host);
    }
    take(nodes) {
        nodes.remove();
        nodes.unlink();
    }
}
/** @internal */
export class HostProjector {
    constructor($controller, host) {
        this.host = host;
        this.host.$controller = $controller;
    }
    get children() {
        return this.host.childNodes;
    }
    subscribeToChildrenChange(callback) {
        // Do nothing since this scenario will never have children.
    }
    provideEncapsulationSource() {
        return this.host.getRootNode();
    }
    project(nodes) {
        nodes.appendTo(this.host);
    }
    take(nodes) {
        nodes.remove();
        nodes.unlink();
    }
}
//# sourceMappingURL=projectors.js.map