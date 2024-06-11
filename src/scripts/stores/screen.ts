import { debounce } from "@scripts/utils/debounce";
import { map } from "nanostores";

export interface IScreenValues {
    width: number;
    height: number;
}

export interface IScreenDebounceValues {
    width: number;
    height: number;
}

export const $screen = map<IScreenValues>({
    width: window.innerWidth,
    height: window.innerHeight,
});

export const $screenDebounce = map<IScreenDebounceValues>({
    width: window.innerWidth,
    height: window.innerHeight,
});


window.addEventListener("resize", () => {
    $screen.setKey("width", window.innerWidth);
    $screen.setKey("height", window.innerHeight);
});

window.addEventListener(
    "resize",
    debounce(() => {
        $screenDebounce.setKey("width", window.innerWidth);
        $screenDebounce.setKey("height", window.innerHeight);
    }, 200)
);