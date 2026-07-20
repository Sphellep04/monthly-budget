import { c as createLucideIcon, r as reactExports, u as useComposedRefs, j as jsxRuntimeExports, P as Primitive, a as Presence, b as createContextScope, d as composeEventHandlers, e as useCallbackRef, f as useLayoutEffect2, g as cn, T as TriangleAlert, L as Link, S as Skeleton, W as Wallet, h as useMonthlySummary, i as useUserSettings, B as Button, k as useActorOrMock } from "./index-Cs1Q4vEJ.js";
import { B as Badge } from "./badge-C5p9bIMy.js";
import { u as useDirection, c as clamp, A as ArrowRight, P as PiggyBank } from "./index-DLr9QfQQ.js";
import { g as getBudgetStatus, C as CATEGORY_ICONS, f as formatCents, a as getMonthName } from "./index-DBqnxCSC.js";
import { C as CircleCheck, M as MonthSelector } from "./MonthSelector-Bc4H7OYD.js";
import { C as CircleAlert } from "./circle-alert-CEsaJTPM.js";
import { T as TrendingUp } from "./trending-up-DHPuu-Gj.js";
import { T as TrendingDown } from "./trending-down-Bv4EBvU7.js";
import { L as LoaderCircle } from "./loader-circle-DNKxoDZG.js";
import { D as Download } from "./download-DyZ_sK2V.js";
import { S as Sparkles } from "./sparkles-_PpqgzoU.js";
import "./chevron-left-CgUlr5xj.js";
import "./chevron-right-F6ZwoAQ7.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode);
function useStateMachine(initialState, machine) {
  return reactExports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}
var SCROLL_AREA_NAME = "ScrollArea";
var [createScrollAreaContext] = createContextScope(SCROLL_AREA_NAME);
var [ScrollAreaProvider, useScrollAreaContext] = createScrollAreaContext(SCROLL_AREA_NAME);
var ScrollArea$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeScrollArea,
      type = "hover",
      dir,
      scrollHideDelay = 600,
      ...scrollAreaProps
    } = props;
    const [scrollArea, setScrollArea] = reactExports.useState(null);
    const [viewport, setViewport] = reactExports.useState(null);
    const [content, setContent] = reactExports.useState(null);
    const [scrollbarX, setScrollbarX] = reactExports.useState(null);
    const [scrollbarY, setScrollbarY] = reactExports.useState(null);
    const [cornerWidth, setCornerWidth] = reactExports.useState(0);
    const [cornerHeight, setCornerHeight] = reactExports.useState(0);
    const [scrollbarXEnabled, setScrollbarXEnabled] = reactExports.useState(false);
    const [scrollbarYEnabled, setScrollbarYEnabled] = reactExports.useState(false);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setScrollArea(node));
    const direction = useDirection(dir);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaProvider,
      {
        scope: __scopeScrollArea,
        type,
        dir: direction,
        scrollHideDelay,
        scrollArea,
        viewport,
        onViewportChange: setViewport,
        content,
        onContentChange: setContent,
        scrollbarX,
        onScrollbarXChange: setScrollbarX,
        scrollbarXEnabled,
        onScrollbarXEnabledChange: setScrollbarXEnabled,
        scrollbarY,
        onScrollbarYChange: setScrollbarY,
        scrollbarYEnabled,
        onScrollbarYEnabledChange: setScrollbarYEnabled,
        onCornerWidthChange: setCornerWidth,
        onCornerHeightChange: setCornerHeight,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            ...scrollAreaProps,
            ref: composedRefs,
            style: {
              position: "relative",
              // Pass corner sizes as CSS vars to reduce re-renders of context consumers
              ["--radix-scroll-area-corner-width"]: cornerWidth + "px",
              ["--radix-scroll-area-corner-height"]: cornerHeight + "px",
              ...props.style
            }
          }
        )
      }
    );
  }
);
ScrollArea$1.displayName = SCROLL_AREA_NAME;
var VIEWPORT_NAME = "ScrollAreaViewport";
var ScrollAreaViewport = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, children, nonce, ...viewportProps } = props;
    const context = useScrollAreaContext(VIEWPORT_NAME, __scopeScrollArea);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`
          },
          nonce
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-radix-scroll-area-viewport": "",
          ...viewportProps,
          ref: composedRefs,
          style: {
            /**
             * We don't support `visible` because the intention is to have at least one scrollbar
             * if this component is used and `visible` will behave like `auto` in that case
             * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#description
             *
             * We don't handle `auto` because the intention is for the native implementation
             * to be hidden if using this component. We just want to ensure the node is scrollable
             * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
             * the browser from having to work out whether to render native scrollbars or not,
             * we tell it to with the intention of hiding them in CSS.
             */
            overflowX: context.scrollbarXEnabled ? "scroll" : "hidden",
            overflowY: context.scrollbarYEnabled ? "scroll" : "hidden",
            ...props.style
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: context.onContentChange, style: { minWidth: "100%", display: "table" }, children })
        }
      )
    ] });
  }
);
ScrollAreaViewport.displayName = VIEWPORT_NAME;
var SCROLLBAR_NAME = "ScrollAreaScrollbar";
var ScrollAreaScrollbar = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
    const isHorizontal = props.orientation === "horizontal";
    reactExports.useEffect(() => {
      isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
      return () => {
        isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
      };
    }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);
    return context.type === "hover" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarHover, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "scroll" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarScroll, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "auto" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarAuto, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "always" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarVisible, { ...scrollbarProps, ref: forwardedRef }) : null;
  }
);
ScrollAreaScrollbar.displayName = SCROLLBAR_NAME;
var ScrollAreaScrollbarHover = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const scrollArea = context.scrollArea;
    let hideTimer = 0;
    if (scrollArea) {
      const handlePointerEnter = () => {
        window.clearTimeout(hideTimer);
        setVisible(true);
      };
      const handlePointerLeave = () => {
        hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
      };
      scrollArea.addEventListener("pointerenter", handlePointerEnter);
      scrollArea.addEventListener("pointerleave", handlePointerLeave);
      return () => {
        window.clearTimeout(hideTimer);
        scrollArea.removeEventListener("pointerenter", handlePointerEnter);
        scrollArea.removeEventListener("pointerleave", handlePointerLeave);
      };
    }
  }, [context.scrollArea, context.scrollHideDelay]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarAuto,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarScroll = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const isHorizontal = props.orientation === "horizontal";
  const debounceScrollEnd = useDebounceCallback(() => send("SCROLL_END"), 100);
  const [state, send] = useStateMachine("hidden", {
    hidden: {
      SCROLL: "scrolling"
    },
    scrolling: {
      SCROLL_END: "idle",
      POINTER_ENTER: "interacting"
    },
    interacting: {
      SCROLL: "interacting",
      POINTER_LEAVE: "idle"
    },
    idle: {
      HIDE: "hidden",
      SCROLL: "scrolling",
      POINTER_ENTER: "interacting"
    }
  });
  reactExports.useEffect(() => {
    if (state === "idle") {
      const hideTimer = window.setTimeout(() => send("HIDE"), context.scrollHideDelay);
      return () => window.clearTimeout(hideTimer);
    }
  }, [state, context.scrollHideDelay, send]);
  reactExports.useEffect(() => {
    const viewport = context.viewport;
    const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
    if (viewport) {
      let prevScrollPos = viewport[scrollDirection];
      const handleScroll = () => {
        const scrollPos = viewport[scrollDirection];
        const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
        if (hasScrollInDirectionChanged) {
          send("SCROLL");
          debounceScrollEnd();
        }
        prevScrollPos = scrollPos;
      };
      viewport.addEventListener("scroll", handleScroll);
      return () => viewport.removeEventListener("scroll", handleScroll);
    }
  }, [context.viewport, isHorizontal, send, debounceScrollEnd]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || state !== "hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": state === "hidden" ? "hidden" : "visible",
      ...scrollbarProps,
      ref: forwardedRef,
      onPointerEnter: composeEventHandlers(props.onPointerEnter, () => send("POINTER_ENTER")),
      onPointerLeave: composeEventHandlers(props.onPointerLeave, () => send("POINTER_LEAVE"))
    }
  ) });
});
var ScrollAreaScrollbarAuto = reactExports.forwardRef((props, forwardedRef) => {
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const { forceMount, ...scrollbarProps } = props;
  const [visible, setVisible] = reactExports.useState(false);
  const isHorizontal = props.orientation === "horizontal";
  const handleResize = useDebounceCallback(() => {
    if (context.viewport) {
      const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
      const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
      setVisible(isHorizontal ? isOverflowX : isOverflowY);
    }
  }, 10);
  useResizeObserver(context.viewport, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarVisible = reactExports.forwardRef((props, forwardedRef) => {
  const { orientation = "vertical", ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const thumbRef = reactExports.useRef(null);
  const pointerOffsetRef = reactExports.useRef(0);
  const [sizes, setSizes] = reactExports.useState({
    content: 0,
    viewport: 0,
    scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
  });
  const thumbRatio = getThumbRatio(sizes.viewport, sizes.content);
  const commonProps = {
    ...scrollbarProps,
    sizes,
    onSizesChange: setSizes,
    hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
    onThumbChange: (thumb) => thumbRef.current = thumb,
    onThumbPointerUp: () => pointerOffsetRef.current = 0,
    onThumbPointerDown: (pointerPos) => pointerOffsetRef.current = pointerPos
  };
  function getScrollPosition(pointerPos, dir) {
    return getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes, dir);
  }
  if (orientation === "horizontal") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarX,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollLeft;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes, context.dir);
            thumbRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollLeft = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) {
            context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
          }
        }
      }
    );
  }
  if (orientation === "vertical") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarY,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollTop;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes);
            thumbRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollTop = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPos);
        }
      }
    );
  }
  return null;
});
var ScrollAreaScrollbarX = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarXChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "horizontal",
      ...scrollbarProps,
      ref: composeRefs,
      sizes,
      style: {
        bottom: 0,
        left: context.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
        right: context.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
        ["--radix-scroll-area-thumb-width"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.x),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollLeft + event.deltaX;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollWidth,
            viewport: context.viewport.offsetWidth,
            scrollbar: {
              size: ref.current.clientWidth,
              paddingStart: toInt(computedStyle.paddingLeft),
              paddingEnd: toInt(computedStyle.paddingRight)
            }
          });
        }
      }
    }
  );
});
var ScrollAreaScrollbarY = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarYChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "vertical",
      ...scrollbarProps,
      ref: composeRefs,
      sizes,
      style: {
        top: 0,
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: "var(--radix-scroll-area-corner-height)",
        ["--radix-scroll-area-thumb-height"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.y),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollTop + event.deltaY;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollHeight,
            viewport: context.viewport.offsetHeight,
            scrollbar: {
              size: ref.current.clientHeight,
              paddingStart: toInt(computedStyle.paddingTop),
              paddingEnd: toInt(computedStyle.paddingBottom)
            }
          });
        }
      }
    }
  );
});
var [ScrollbarProvider, useScrollbarContext] = createScrollAreaContext(SCROLLBAR_NAME);
var ScrollAreaScrollbarImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeScrollArea,
    sizes,
    hasThumb,
    onThumbChange,
    onThumbPointerUp,
    onThumbPointerDown,
    onThumbPositionChange,
    onDragScroll,
    onWheelScroll,
    onResize,
    ...scrollbarProps
  } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, __scopeScrollArea);
  const [scrollbar, setScrollbar] = reactExports.useState(null);
  const composeRefs = useComposedRefs(forwardedRef, (node) => setScrollbar(node));
  const rectRef = reactExports.useRef(null);
  const prevWebkitUserSelectRef = reactExports.useRef("");
  const viewport = context.viewport;
  const maxScrollPos = sizes.content - sizes.viewport;
  const handleWheelScroll = useCallbackRef(onWheelScroll);
  const handleThumbPositionChange = useCallbackRef(onThumbPositionChange);
  const handleResize = useDebounceCallback(onResize, 10);
  function handleDragScroll(event) {
    if (rectRef.current) {
      const x = event.clientX - rectRef.current.left;
      const y = event.clientY - rectRef.current.top;
      onDragScroll({ x, y });
    }
  }
  reactExports.useEffect(() => {
    const handleWheel = (event) => {
      const element = event.target;
      const isScrollbarWheel = scrollbar == null ? void 0 : scrollbar.contains(element);
      if (isScrollbarWheel) handleWheelScroll(event, maxScrollPos);
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel, { passive: false });
  }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);
  reactExports.useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange]);
  useResizeObserver(scrollbar, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollbarProvider,
    {
      scope: __scopeScrollArea,
      scrollbar,
      hasThumb,
      onThumbChange: useCallbackRef(onThumbChange),
      onThumbPointerUp: useCallbackRef(onThumbPointerUp),
      onThumbPositionChange: handleThumbPositionChange,
      onThumbPointerDown: useCallbackRef(onThumbPointerDown),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          ...scrollbarProps,
          ref: composeRefs,
          style: { position: "absolute", ...scrollbarProps.style },
          onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
            const mainPointer = 0;
            if (event.button === mainPointer) {
              const element = event.target;
              element.setPointerCapture(event.pointerId);
              rectRef.current = scrollbar.getBoundingClientRect();
              prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
              document.body.style.webkitUserSelect = "none";
              if (context.viewport) context.viewport.style.scrollBehavior = "auto";
              handleDragScroll(event);
            }
          }),
          onPointerMove: composeEventHandlers(props.onPointerMove, handleDragScroll),
          onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
            const element = event.target;
            if (element.hasPointerCapture(event.pointerId)) {
              element.releasePointerCapture(event.pointerId);
            }
            document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
            if (context.viewport) context.viewport.style.scrollBehavior = "";
            rectRef.current = null;
          })
        }
      )
    }
  );
});
var THUMB_NAME = "ScrollAreaThumb";
var ScrollAreaThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...thumbProps } = props;
    const scrollbarContext = useScrollbarContext(THUMB_NAME, props.__scopeScrollArea);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || scrollbarContext.hasThumb, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumbImpl, { ref: forwardedRef, ...thumbProps }) });
  }
);
var ScrollAreaThumbImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, style, ...thumbProps } = props;
    const scrollAreaContext = useScrollAreaContext(THUMB_NAME, __scopeScrollArea);
    const scrollbarContext = useScrollbarContext(THUMB_NAME, __scopeScrollArea);
    const { onThumbPositionChange } = scrollbarContext;
    const composedRef = useComposedRefs(
      forwardedRef,
      (node) => scrollbarContext.onThumbChange(node)
    );
    const removeUnlinkedScrollListenerRef = reactExports.useRef(void 0);
    const debounceScrollEnd = useDebounceCallback(() => {
      if (removeUnlinkedScrollListenerRef.current) {
        removeUnlinkedScrollListenerRef.current();
        removeUnlinkedScrollListenerRef.current = void 0;
      }
    }, 100);
    reactExports.useEffect(() => {
      const viewport = scrollAreaContext.viewport;
      if (viewport) {
        const handleScroll = () => {
          debounceScrollEnd();
          if (!removeUnlinkedScrollListenerRef.current) {
            const listener = addUnlinkedScrollListener(viewport, onThumbPositionChange);
            removeUnlinkedScrollListenerRef.current = listener;
            onThumbPositionChange();
          }
        };
        onThumbPositionChange();
        viewport.addEventListener("scroll", handleScroll);
        return () => viewport.removeEventListener("scroll", handleScroll);
      }
    }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": scrollbarContext.hasThumb ? "visible" : "hidden",
        ...thumbProps,
        ref: composedRef,
        style: {
          width: "var(--radix-scroll-area-thumb-width)",
          height: "var(--radix-scroll-area-thumb-height)",
          ...style
        },
        onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, (event) => {
          const thumb = event.target;
          const thumbRect = thumb.getBoundingClientRect();
          const x = event.clientX - thumbRect.left;
          const y = event.clientY - thumbRect.top;
          scrollbarContext.onThumbPointerDown({ x, y });
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, scrollbarContext.onThumbPointerUp)
      }
    );
  }
);
ScrollAreaThumb.displayName = THUMB_NAME;
var CORNER_NAME = "ScrollAreaCorner";
var ScrollAreaCorner = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useScrollAreaContext(CORNER_NAME, props.__scopeScrollArea);
    const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
    const hasCorner = context.type !== "scroll" && hasBothScrollbarsVisible;
    return hasCorner ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaCornerImpl, { ...props, ref: forwardedRef }) : null;
  }
);
ScrollAreaCorner.displayName = CORNER_NAME;
var ScrollAreaCornerImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeScrollArea, ...cornerProps } = props;
  const context = useScrollAreaContext(CORNER_NAME, __scopeScrollArea);
  const [width, setWidth] = reactExports.useState(0);
  const [height, setHeight] = reactExports.useState(0);
  const hasSize = Boolean(width && height);
  useResizeObserver(context.scrollbarX, () => {
    var _a;
    const height2 = ((_a = context.scrollbarX) == null ? void 0 : _a.offsetHeight) || 0;
    context.onCornerHeightChange(height2);
    setHeight(height2);
  });
  useResizeObserver(context.scrollbarY, () => {
    var _a;
    const width2 = ((_a = context.scrollbarY) == null ? void 0 : _a.offsetWidth) || 0;
    context.onCornerWidthChange(width2);
    setWidth(width2);
  });
  return hasSize ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      ...cornerProps,
      ref: forwardedRef,
      style: {
        width,
        height,
        position: "absolute",
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: 0,
        ...props.style
      }
    }
  ) : null;
});
function toInt(value) {
  return value ? parseInt(value, 10) : 0;
}
function getThumbRatio(viewportSize, contentSize) {
  const ratio = viewportSize / contentSize;
  return isNaN(ratio) ? 0 : ratio;
}
function getThumbSize(sizes) {
  const ratio = getThumbRatio(sizes.viewport, sizes.content);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
  return Math.max(thumbSize, 18);
}
function getScrollPositionFromPointer(pointerPos, pointerOffset, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const thumbCenter = thumbSizePx / 2;
  const offset = pointerOffset || thumbCenter;
  const thumbOffsetFromEnd = thumbSizePx - offset;
  const minPointerPos = sizes.scrollbar.paddingStart + offset;
  const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
  const maxScrollPos = sizes.content - sizes.viewport;
  const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange);
  return interpolate(pointerPos);
}
function getThumbOffsetFromScroll(scrollPos, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const scrollbar = sizes.scrollbar.size - scrollbarPadding;
  const maxScrollPos = sizes.content - sizes.viewport;
  const maxThumbPos = scrollbar - thumbSizePx;
  const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const scrollWithoutMomentum = clamp(scrollPos, scrollClampRange);
  const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
  return interpolate(scrollWithoutMomentum);
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
  return scrollPos > 0 && scrollPos < maxScrollPos;
}
var addUnlinkedScrollListener = (node, handler = () => {
}) => {
  let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
  let rAF = 0;
  (function loop() {
    const position = { left: node.scrollLeft, top: node.scrollTop };
    const isHorizontalScroll = prevPosition.left !== position.left;
    const isVerticalScroll = prevPosition.top !== position.top;
    if (isHorizontalScroll || isVerticalScroll) handler();
    prevPosition = position;
    rAF = window.requestAnimationFrame(loop);
  })();
  return () => window.cancelAnimationFrame(rAF);
};
function useDebounceCallback(callback, delay) {
  const handleCallback = useCallbackRef(callback);
  const debounceTimerRef = reactExports.useRef(0);
  reactExports.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
  return reactExports.useCallback(() => {
    window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(handleCallback, delay);
  }, [handleCallback, delay]);
}
function useResizeObserver(element, onResize) {
  const handleResize = useCallbackRef(onResize);
  useLayoutEffect2(() => {
    let rAF = 0;
    if (element) {
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}
var Root = ScrollArea$1;
var Viewport = ScrollAreaViewport;
var Corner = ScrollAreaCorner;
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}
function AlertsPanel({
  summaries,
  alertThreshold = 80
}) {
  const alerts = summaries.filter((s) => {
    const status = getBudgetStatus(s, alertThreshold);
    return status === "warning" || status === "over-budget";
  });
  if (alerts.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 px-4 py-3.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-emerald-700 dark:text-emerald-400 font-display leading-none", children: "All budgets on track!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-600/70 dark:text-emerald-500/70 font-body mt-0.5", children: "You're within your limits across all categories this month." })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border bg-card shadow-subtle overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3 border-b border-border bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-warning flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold font-display text-foreground leading-none", children: "Budget Alerts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border bg-warning/10 text-warning border-warning/30 font-mono",
              children: alerts.length
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-56", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/60", children: alerts.map((s, i) => {
          const status = getBudgetStatus(s, alertThreshold);
          const limit = Number(s.budget.limitCents);
          const spent = Number(s.totalSpentCents);
          const pct = limit > 0 ? Math.round(spent / limit * 100) : 0;
          const icon = CATEGORY_ICONS[s.budget.category] ?? CATEGORY_ICONS.Other;
          const isOver = status === "over-budget";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors duration-150",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0",
                    style: {
                      background: s.budget.color ? `${s.budget.color}20` : "oklch(var(--primary)/0.10)"
                    },
                    "aria-hidden": "true",
                    children: icon
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold font-display text-foreground truncate leading-none", children: s.budget.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono mt-0.5 tabular-nums", children: [
                    formatCents(s.totalSpentCents),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "of" }),
                    " ",
                    formatCents(s.budget.limitCents)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `font-mono text-xs font-bold tabular-nums ${isOver ? "text-destructive" : "text-warning"}`,
                      children: [
                        pct,
                        "%"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "outline",
                      className: `text-[10px] font-semibold px-2 py-0.5 rounded-full border gap-1 font-body ${isOver ? "bg-destructive/10 text-destructive border-destructive/30" : "bg-warning/10 text-warning border-warning/30"}`,
                      children: [
                        isOver ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-2.5 w-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-2.5 w-2.5" }),
                        isOver ? "Over" : "Near"
                      ]
                    }
                  )
                ] })
              ]
            },
            s.budget.id.toString()
          );
        }) }) })
      ]
    }
  );
}
const STATUS_CONFIG = {
  "on-track": {
    label: "On Track",
    dot: "bg-emerald-500",
    labelClass: "text-emerald-700 dark:text-emerald-400",
    barClass: "bg-emerald-500",
    remainingClass: "text-emerald-700 dark:text-emerald-400"
  },
  warning: {
    label: "Near Limit",
    dot: "bg-amber-500",
    labelClass: "text-amber-600 dark:text-amber-400",
    barClass: "bg-amber-500",
    remainingClass: "text-amber-600 dark:text-amber-400"
  },
  "over-budget": {
    label: "Over Budget",
    dot: "bg-destructive",
    labelClass: "text-destructive",
    barClass: "bg-destructive",
    remainingClass: "text-destructive"
  }
};
function ProgressBar({ pct, color }) {
  const [mounted, setMounted] = reactExports.useState(false);
  const timer = reactExports.useRef(null);
  reactExports.useEffect(() => {
    timer.current = setTimeout(() => setMounted(true), 80);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-muted/70 rounded-full overflow-hidden", "aria-hidden": true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-full rounded-full transition-all",
      style: {
        width: mounted ? `${Math.min(pct, 100)}%` : "0%",
        background: color,
        transition: "width 0.75s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: pct > 80 ? `0 0 6px ${color}60` : void 0
      }
    }
  ) });
}
function BudgetCard({ summary, index, alertThreshold = 80 }) {
  const { budget, totalSpentCents, remainingCents } = summary;
  const status = getBudgetStatus(summary, alertThreshold);
  const limit = Number(budget.limitCents);
  const spent = Number(totalSpentCents);
  const remaining = Number(remainingCents);
  const pct = limit > 0 ? spent / limit * 100 : 0;
  const icon = CATEGORY_ICONS[budget.category] ?? CATEGORY_ICONS.Other;
  const cfg = STATUS_CONFIG[status];
  const accentColor = budget.color ?? "#6366f1";
  const staggerClass = `animate-stagger-${Math.min(index + 1, 6)}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/budgets/$id",
      params: { id: budget.id.toString() },
      className: cn("group block slide-up", staggerClass),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-card border border-border/80 rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-200 hover:border-border hover:shadow-elevated hover:-translate-y-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[3px] w-full flex-shrink-0", style: { background: accentColor } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 p-5 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0",
                style: { background: `${accentColor}18` },
                "aria-hidden": true,
                children: icon
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-[0.875rem] text-foreground truncate leading-tight", children: budget.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5 truncate", children: budget.category })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-1.5 flex-shrink-0 px-2 py-1 rounded-full bg-muted/60 text-[10px] font-semibold", cfg.labelClass), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("w-1.5 h-1.5 rounded-full flex-shrink-0", cfg.dot) }),
              cfg.label
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.14em] mb-1.5", children: remaining >= 0 ? "Remaining" : "Over budget" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("font-mono text-[1.75rem] font-bold tabular-nums leading-none", cfg.remainingClass), children: formatCents(remaining < 0 ? BigInt(Math.abs(remaining)) : remainingCents) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-muted-foreground tabular-nums", children: [
                formatCents(totalSpentCents),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 mx-1", children: "/" }),
                formatCents(budget.limitCents)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("font-mono font-semibold tabular-nums", cfg.labelClass), children: [
                Math.min(pct, 999).toFixed(0),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { pct, color: pct >= 100 ? "#ef4444" : pct >= alertThreshold ? "#f59e0b" : accentColor })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-t border-border/40 bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-end gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors duration-150", children: [
          "View details",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 11, className: "group-hover:translate-x-0.5 transition-transform duration-150" })
        ] }) })
      ] })
    }
  );
}
function AnimatedBar({ pct, colorClass }) {
  const [mounted, setMounted] = reactExports.useState(false);
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    timerRef.current = setTimeout(() => setMounted(true), 120);
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-muted/60 rounded-full overflow-hidden", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `h-full rounded-full transition-all ${colorClass}`,
      style: {
        width: mounted ? `${Math.min(pct, 100)}%` : "0%",
        transition: "width 0.9s cubic-bezier(0.4, 0, 0.2, 1)"
      }
    }
  ) });
}
function MonthlySummaryHeader({ summary, isLoading }) {
  if (isLoading || !summary) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[148px] rounded-2xl" });
  }
  const totalBudget = Number(summary.totalBudgetCents);
  const totalSpent = Number(summary.totalSpentCents);
  const remaining = totalBudget - totalSpent;
  const pct = totalBudget > 0 ? Math.min(totalSpent / totalBudget * 100, 100) : 0;
  const isOverBudget = remaining < 0;
  const isNearLimit = !isOverBudget && remaining / Math.max(totalBudget, 1) < 0.2;
  const barColorClass = isOverBudget ? "bg-destructive" : isNearLimit ? "bg-amber-500" : "bg-primary";
  const remainingValueClass = isOverBudget ? "text-destructive" : isNearLimit ? "text-amber-600 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400";
  const remainingSub = isOverBudget ? `${formatCents(Math.abs(remaining))} over limit` : isNearLimit ? "Approaching limit" : "You're doing great";
  const stats = [
    {
      icon: Wallet,
      label: "Total Budget",
      value: formatCents(summary.totalBudgetCents),
      sub: `${summary.budgets.length} categor${summary.budgets.length === 1 ? "y" : "ies"}`,
      valueClass: "text-foreground",
      iconBg: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      icon: TrendingUp,
      label: "Total Spent",
      value: formatCents(summary.totalSpentCents),
      sub: `${pct.toFixed(1)}% of budget`,
      valueClass: "text-foreground",
      iconBg: "bg-secondary/10",
      iconColor: "text-secondary"
    },
    {
      icon: isOverBudget ? TrendingDown : PiggyBank,
      label: isOverBudget ? "Over Budget" : "Remaining",
      value: formatCents(Math.abs(remaining)),
      sub: remainingSub,
      valueClass: remainingValueClass,
      iconBg: isOverBudget ? "bg-destructive/10" : isNearLimit ? "bg-amber-500/10" : "bg-emerald-500/10",
      iconColor: isOverBudget ? "text-destructive" : isNearLimit ? "text-amber-600 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden shadow-subtle slide-up animate-stagger-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/60", children: stats.map(({ icon: Icon, label, value, sub, valueClass, iconBg, iconColor }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 px-5 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex-shrink-0 w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 ${iconColor}` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.14em] mb-1", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-mono text-2xl font-bold tabular-nums leading-none ${valueClass}`, children: value }),
        sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-1", children: sub })
      ] })
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/60 px-5 py-3 bg-muted/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.14em]", children: "Monthly Progress" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-mono text-xs font-bold tabular-nums ${isOverBudget ? "text-destructive" : isNearLimit ? "text-amber-600 dark:text-amber-400" : "text-primary"}`, children: [
          pct.toFixed(1),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedBar, { pct, colorClass: barColorClass }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between mt-1.5", children: [0, 25, 50, 75, 100].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: `text-[9px] font-mono tabular-nums ${pct >= m ? "text-muted-foreground" : "text-muted-foreground/35"}`,
          children: [
            m,
            "%"
          ]
        },
        m
      )) })
    ] })
  ] });
}
function BudgetGridSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 rounded-2xl" }, k)) });
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-20 px-8 text-center rounded-2xl border border-dashed border-border bg-card/40 shadow-subtle",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shadow-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-10 w-10 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 rounded-2xl bg-primary/5 blur-xl scale-125 pointer-events-none",
              "aria-hidden": "true"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-xl text-foreground mb-2 tracking-tight", children: "No budgets set up yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-8 font-body leading-relaxed", children: "Take control of your spending by creating your first budget category. It only takes a minute — you'll get instant insight into where your money goes." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/budgets", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "gap-2 font-body px-6 h-10 rounded-xl shadow-elevated button-hover transition-spring", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-4 w-4" }),
          "Create your first budget"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-8 opacity-30", "aria-hidden": "true", children: ["d1", "d2", "d3", "d4", "d5"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-1.5 h-1.5 rounded-full bg-muted-foreground"
          },
          id
        )) })
      ]
    }
  );
}
function ExportCsvButton({
  year,
  month,
  summary
}) {
  const [isExporting, setIsExporting] = reactExports.useState(false);
  const { actor } = useActorOrMock();
  const handleExport = async () => {
    if (!summary || !actor) return;
    setIsExporting(true);
    try {
      const monthName = getMonthName(month).toLowerCase();
      const filename = `budget-${monthName}-${year}.csv`;
      const lines = [];
      lines.push("=== BUDGET SUMMARY ===");
      lines.push(
        "Category,Budget Limit (N$),Amount Spent (N$),Remaining (N$),% Used"
      );
      for (const bs of summary.budgets) {
        const limit = Number(bs.budget.limitCents) / 100;
        const spent = Number(bs.totalSpentCents) / 100;
        const remaining = Number(bs.remainingCents) / 100;
        const pct = limit > 0 ? Math.round(spent / limit * 100) : 0;
        lines.push(
          `"${bs.budget.name}",${limit.toFixed(2)},${spent.toFixed(2)},${remaining.toFixed(2)},${pct}%`
        );
      }
      const totalLimit = Number(summary.totalBudgetCents) / 100;
      const totalSpent = Number(summary.totalSpentCents) / 100;
      const totalPct = totalLimit > 0 ? Math.round(totalSpent / totalLimit * 100) : 0;
      lines.push(
        `"TOTAL",${totalLimit.toFixed(2)},${totalSpent.toFixed(2)},${(totalLimit - totalSpent).toFixed(2)},${totalPct}%`
      );
      lines.push("");
      lines.push("=== DETAILED EXPENSES ===");
      lines.push("Date,Category,Amount (N$),Notes");
      const monthPad = String(month).padStart(2, "0");
      const monthPrefix = `${year}-${monthPad}`;
      for (const bs of summary.budgets) {
        const rawExpenses = await actor.listExpenses(bs.budget.id);
        const expenses = rawExpenses.filter(
          (e) => e.date.startsWith(monthPrefix)
        );
        lines.push(`"--- ${bs.budget.name} ---","","",""`);
        if (expenses.length === 0) {
          lines.push(`"(no expenses)","","",""`);
        } else {
          for (const expense of expenses.sort(
            (a2, b) => a2.date.localeCompare(b.date)
          )) {
            const amount = Number(expense.amountCents) / 100;
            const notes = expense.notes ? `"${expense.notes.replace(/"/g, '""')}"` : "";
            lines.push(
              `"${expense.date}","${bs.budget.name}",${amount.toFixed(2)},${notes}`
            );
          }
        }
      }
      const blob = new Blob([lines.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      variant: "outline",
      size: "sm",
      className: "gap-2 font-body h-9 px-3.5 rounded-xl border-border hover:border-primary/40 hover:bg-primary/5 transition-smooth shadow-subtle",
      onClick: handleExport,
      disabled: !summary || !actor || isExporting,
      children: [
        isExporting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
        isExporting ? "Exporting…" : "Export CSV"
      ]
    }
  );
}
function getGreeting() {
  const h = (/* @__PURE__ */ new Date()).getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
function DashboardPage() {
  const now = /* @__PURE__ */ new Date();
  const [year, setYear] = reactExports.useState(now.getFullYear());
  const [month, setMonth] = reactExports.useState(now.getMonth() + 1);
  const { data: summary, isLoading } = useMonthlySummary(year, month);
  const { data: userSettings } = useUserSettings();
  const alertThreshold = (userSettings == null ? void 0 : userSettings.alertThresholdPercent) ?? 80;
  const budgets = (summary == null ? void 0 : summary.budgets) ?? [];
  const hasBudgets = budgets.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-5 md:p-7 space-y-7 max-w-7xl mx-auto page-enter",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.14em] mb-1.5", children: getGreeting() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground tracking-tight leading-none", children: getMonthName(month) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xl text-muted-foreground/60 font-medium tabular-nums leading-none", children: year })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "Track spending and stay on top of your finances" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MonthSelector,
              {
                year,
                month,
                onChange: (y, m) => {
                  setYear(y);
                  setMonth(m);
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExportCsvButton, { year, month, summary }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/budgets", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "gap-2 font-body h-9 px-4 rounded-xl shadow-elevated button-hover transition-spring",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-4 w-4" }),
                  "New Budget"
                ]
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MonthlySummaryHeader, { summary, isLoading }),
        hasBudgets && /* @__PURE__ */ jsxRuntimeExports.jsx(AlertsPanel, { summaries: budgets, alertThreshold }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground leading-none", children: "Budget Categories" }),
              hasBudgets && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body mt-1", children: [
                budgets.length,
                " categor",
                budgets.length === 1 ? "y" : "ies",
                " ",
                "this month"
              ] })
            ] }),
            hasBudgets && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/budgets",
                className: "inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium font-body transition-colors duration-200 group",
                children: [
                  "Manage budgets",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" })
                ]
              }
            )
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(BudgetGridSkeleton, {}) : hasBudgets ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
              children: budgets.map((bs, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                BudgetCard,
                {
                  summary: bs,
                  index: i + 1,
                  alertThreshold
                },
                bs.budget.id.toString()
              ))
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {})
        ] })
      ]
    }
  );
}
export {
  DashboardPage
};
