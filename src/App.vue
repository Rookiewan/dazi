<template>
  <div id="app">
    <button id="btnSub">submit</button>
    <form>
      <input type="file" class="choose-photo" @change="select" v-model="photo">
    </form>
    <img :src="photoUrl" alt="">
  </div>
</template>

<script>
  import ExifJs from 'exif-js'
  window.ExifJs = ExifJs
  export default {
    data () {
      return {
        photoUrl: null,
        photo: null,
        ratio: 1
      }
    },
    methods: {
      select (e) {
        var file = e.target.files[0]
        var Orientation = null
        var reader = new window.FileReader()
        ExifJs.EXIF.getData(file, function () {
          ExifJs.EXIF.getAllTags(this)
          Orientation = ExifJs.EXIF.getTag(this, 'Orientation')
          reader.readAsDataURL(file)
        })
        // console.log(this.photo)
        reader.onload = (e) => {
          // this.photoUrl = reader.result
          // this.photoUrltest = reader.result
          var image = new window.Image()
          image.src = reader.result
          // image.src = this.photoUrltest
          image.onload = () => {
            var angle = 0
            this.ratio = image.width / image.height
            image.width = (window.innerWidth - image.width) > 0 ? window.innerWidth : image.width
            image.height = image.width / this.ratio
            if (navigator.userAgent.match(/iphone/i)) {
              if (Orientation !== '' && Orientation !== 1) {
                switch (Orientation) {
                  case 6:// 需要顺时针（向左）90度旋转
                    // rotateImg(this,'left',canvas)
                    // window.alert('顺时针 90')
                    angle = 90
                    break
                  case 8:// 需要逆时针（向右）90度旋转
                    // rotateImg(this,'right',canvas)
                    window.alert('逆时针 90')
                    angle = -90
                    break
                  case 3:// 需要180度旋转
                    // rotateImg(this,'right',canvas)// 转两次
                    // rotateImg(this,'right',canvas)
                    // window.alert('180')
                    angle = 180
                    break
                }
              }
            }
            this.draw(image, angle)
          }
        }
      },
      draw (image, angle) {
        var canvas = document.createElement('canvas')
        canvas.width = window.innerWidth
        canvas.height = canvas.width / this.ratio
        var drawW = canvas.width
        var drawH = canvas.height
        var ctx = canvas.getContext('2d')
        if (angle === 90) {
          canvas.height = canvas.width * this.ratio
          drawW = canvas.height
          drawH = canvas.width
          ctx.translate(drawH, 0)
          ctx.rotate(angle * Math.PI / 180)
        } else if (angle === -90) {
          canvas.height = canvas.width * this.ratio
          drawW = canvas.height
          drawH = canvas.width
          ctx.translate(0, drawW)
          ctx.rotate(angle * Math.PI / 180)
        } else if (angle === 180) {
          ctx.translate(drawW, drawH)
          ctx.rotate(Math.PI)
        }
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, drawW, drawH)
        this.photoUrl = canvas.toDataURL('image/png')
        // console.log(123)
        // var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        // this.photoUrl = imageData
        // console.log(imageData)
      }
    },
    ready () {
      var btn = document.querySelector('#btnSub')
      btn.onmousedown = function () {
        console.log('submit')
      }
      // function activateEvent(btn) {
      //   var eventObj = document.createEvent('MouseEvents')
      //   eventObj.initEvent('mousedown', true, false)
      //   btn.dispatchEvent(eventObj)
      // }
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
