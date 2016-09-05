<template>
  <div id="app">
    <form>
      <input type="file" class="choose-photo" @change="select" v-model="photo">
    </form>
    <img :src="photoUrltest" alt="">
    <img :src="photoUrl" alt="">
  </div>
</template>

<script>
  import ExifJs from 'exif-js'
  window.ExifJs = ExifJs
  export default {
    data () {
      return {
        photoUrltest: null,
        photoUrl: null,
        photo: null
      }
    },
    methods: {
      select (e) {
        var file = e.target.files[0]
        var Orientation = null
        ExifJs.EXIF.getData(file, function () {
          ExifJs.EXIF.getAllTags(this)
          Orientation = ExifJs.EXIF.getTag(this, 'Orientation')
        })
        // console.log(this.photo)
        var reader = new window.FileReader()
        reader.onload = (e) => {
          // this.photoUrl = reader.result
          this.photoUrltest = reader.result
          var image = new window.Image()
          // image.src = reader.result
          image.src = this.photoUrltest
          image.onload = () => {
            if (navigator.userAgent.match(/iphone/i)) {
              // if(Orientation != '' && Orientation != 1){
              //   switch(Orientation){
              //     case 6:// 需要顺时针（向左）90度旋转
              //       rotateImg(this,'left',canvas)
              //       break;
              //     case 8:// 需要逆时针（向右）90度旋转
              //       rotateImg(this,'right',canvas)
              //       break;
              //     case 3:// 需要180度旋转
              //       rotateImg(this,'right',canvas)// 转两次
              //       rotateImg(this,'right',canvas)
              //       break;
              //   }
              // }
            }
            image.width = (window.innerWidth - image.width) > 0 ? image.width : window.innerWidth
            // image.height =
            console.log(image.width, image.height)
            this.draw(image)
          }
        }
        reader.readAsDataURL(file)
      },
      draw (image) {
        var canvas = document.createElement('canvas')
        // var canvas = document.querySelector('#canvas')
        canvas.width = window.innerWidth
        canvas.height = (window.innerWidth * image.height) / image.width
        console.log(canvas.width, canvas.height)
        console.log(image.width, image.height)
        var ctx = canvas.getContext('2d')
        // ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, window.innerWidth, window.innerWidth * (image.height / image.width))
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        this.photoUrl = canvas.toDataURL('image/png')
        // console.log(123)
        // var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        // this.photoUrl = imageData
        // console.log(imageData)
      }
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }
  .choose-photo {
    position: absolute;
    height: 1rem;
    left: 0;
    top: 1rem;
    background: red;
  }
  img {
    /*width: 100%;*/
    background: #ccc;
  }
</style>
