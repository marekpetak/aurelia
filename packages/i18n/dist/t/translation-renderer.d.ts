import { AttrSyntax, BindingSymbol, BindingCommandInstance, PlainAttributeSymbol } from '@aurelia/jit';
import { BindingMode, BindingType, ICallBindingInstruction, IController, IDOM, IExpressionParser, IInstructionRenderer, IObserverLocator, IRenderContext, IsBindingBehavior, LifecycleFlags } from '@aurelia/runtime';
export declare const TranslationInstructionType = "tt";
export declare class TranslationAttributePattern {
    [key: string]: ((rawName: string, rawValue: string, parts: string[]) => AttrSyntax);
    static registerAlias(alias: string): void;
}
export declare class TranslationBindingInstruction {
    from: IsBindingBehavior;
    to: string;
    readonly type: string;
    mode: BindingMode.toView;
    constructor(from: IsBindingBehavior, to: string);
}
export declare class TranslationBindingCommand implements BindingCommandInstance {
    readonly bindingType: BindingType.CustomCommand;
    compile(binding: PlainAttributeSymbol | BindingSymbol): TranslationBindingInstruction;
}
export declare class TranslationBindingRenderer implements IInstructionRenderer {
    private readonly parser;
    private readonly observerLocator;
    constructor(parser: IExpressionParser, observerLocator: IObserverLocator);
    render(flags: LifecycleFlags, dom: IDOM, context: IRenderContext, renderable: IController, target: HTMLElement, instruction: ICallBindingInstruction): void;
}
export declare const TranslationBindInstructionType = "tbt";
export declare class TranslationBindAttributePattern {
    [key: string]: ((rawName: string, rawValue: string, parts: string[]) => AttrSyntax);
    static registerAlias(alias: string): void;
}
export declare class TranslationBindBindingInstruction {
    from: IsBindingBehavior;
    to: string;
    readonly type: string;
    mode: BindingMode.toView;
    constructor(from: IsBindingBehavior, to: string);
}
export declare class TranslationBindBindingCommand implements BindingCommandInstance {
    readonly bindingType: BindingType.BindCommand;
    compile(binding: PlainAttributeSymbol | BindingSymbol): TranslationBindBindingInstruction;
}
export declare class TranslationBindBindingRenderer implements IInstructionRenderer {
    private readonly parser;
    private readonly observerLocator;
    constructor(parser: IExpressionParser, observerLocator: IObserverLocator);
    render(flags: LifecycleFlags, dom: IDOM, context: IRenderContext, renderable: IController, target: HTMLElement, instruction: ICallBindingInstruction): void;
}
//# sourceMappingURL=translation-renderer.d.ts.map