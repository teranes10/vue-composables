import { createVNode, defineComponent, render, shallowRef, watch, h, VNodeTypes } from "vue";
import { useDebounce } from "../events/Debounce";
import { toPng } from "html-to-image";

export type HtmlToImageOptions = {
    background?: string;
    skipFonts?: boolean;
    cacheBust?: boolean;
    delay?: number;
    style?: Partial<CSSStyleDeclaration>
}

export type Image = {
    dataUrl: string;
    width: number;
    height: number;
    aspectRadio: number;
}

export function useHtmlToImage(component: VNodeTypes, { background = "#ffffff", skipFonts = true, cacheBust = true, delay = 1, style }: HtmlToImageOptions = {}): Promise<Image> {
    return new Promise((resolve, reject) => {
        try {
            const vNode = defineComponent({
                setup() {
                    const contentEl = shallowRef();

                    watch(contentEl, useDebounce(async () => {
                        try {
                            if (!contentEl.value) {
                                return;
                            }

                            const dataUrl = await toPng(contentEl.value, { skipFonts, cacheBust });
                            var img = new Image();
                            img.onload = () => {
                                resolve({
                                    dataUrl,
                                    width: img.width,
                                    height: img.height,
                                    aspectRadio: img.width / img.height,
                                })
                            }
                            img.src = dataUrl;

                            contentEl.value.remove();
                        } catch (error) {
                            reject(error)
                        }
                    }, delay))

                    return () => h('div', {
                        ref: contentEl, style: {
                            display: 'inline-flex', background,
                            ...(style && style)
                        }
                    }, h(component as any));
                }
            })

            const node = createVNode(vNode);
            const container = getContainer();
            if (node && container) {
                render(node, container);
            }
        } catch (error) {
            reject(error)
        }
    })
}

export function useGetBackgroundColor(element: Element) {
    let bgColor = window.getComputedStyle(element)?.getPropertyValue('background-color');
    if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        return bgColor;
    }

    if (element.parentElement) {
        bgColor = useGetBackgroundColor(element.parentElement);
        return bgColor;
    }

    return '#ffffff';
}

const getContainer = (): HTMLElement | undefined => {
    if (document) {
        let container = document.getElementById("renderer-container");

        if (!container) {
            container = document.createElement("div");
            container.id = "renderer-container";
            container.style.position = 'absolute';
            container.style.width = '1px';
            container.style.height = '1px';
            container.style.padding = '0';
            container.style.margin = '-1px';
            container.style.overflow = 'hidden';
            container.style.clip = 'rect(0, 0, 0, 0)';
            container.style.whiteSpace = 'nowrap';
            container.style.borderWidth = '0';

            document.body.append(container);
        }

        return container;
    }

    return undefined;
};