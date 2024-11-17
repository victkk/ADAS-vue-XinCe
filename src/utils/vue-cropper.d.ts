declare module "vue-cropper" {
  import { DefineComponent } from "vue";

  const VueCropper: DefineComponent<
    {},
    {},
    { getCroppedCanvas: HTMLCanvasElement }
  >;

  export { VueCropper, VueCropperInstance };
}
