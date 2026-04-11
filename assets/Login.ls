{
  "_$ver": 1,
  "_$id": "pr6hl2hu",
  "_$preloads": [
    "res://a7c53917-817e-4769-82e3-04ffb4b622e7",
    "res://5e95be6b-617c-4f21-9f90-3d37e3a4f0d5",
    "res://574a7c9c-8da0-4454-9f4c-0b596afd48cd"
  ],
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "Scene2D",
  "width": 2670,
  "height": 1200,
  "_$comp": [
    {
      "_$type": "88cea8c6-4a81-42db-a610-0031e37e3bcb",
      "scriptPath": "../src/LoginScript.ts",
      "accountTextInput": {
        "_$ref": "b7a6xxay"
      },
      "btn": {
        "_$ref": "x2vsmmum"
      },
      "btn1": {
        "_$ref": "3wb4d8th"
      },
      "settingbtn": {
        "_$ref": "nm8iqnfl"
      },
      "image": {
        "_$ref": "ni7de579"
      },
      "window": {
        "_$ref": "k14chdpq"
      },
      "agreeBtn": {
        "_$ref": "umeykjhc"
      },
      "disagreeBtn": {
        "_$ref": "zqo7l9bj"
      },
      "mitBtn": {
        "_$ref": "xhct63er"
      },
      "serverBtn": {
        "_$ref": "b6wrpk91"
      },
      "provBtn": {
        "_$ref": "b35bbdhd"
      }
    }
  ],
  "_$child": [
    {
      "_$id": "d3yz20nd",
      "_$type": "Sprite",
      "name": "Sprite",
      "width": 2670,
      "height": 1200,
      "texture": {
        "_$uuid": "14e236d7-8edd-4ef8-9d08-d755f31d768a",
        "_$type": "Texture"
      },
      "_mouseState": 2,
      "_$child": [
        {
          "_$id": "b7a6xxay",
          "_$type": "TextInput",
          "name": "account",
          "x": 1067,
          "y": 415,
          "width": 537,
          "height": 70,
          "_mouseState": 2,
          "centerX": 0,
          "centerY": -150,
          "text": "",
          "font": "KaiTi",
          "fontSize": 30,
          "singleCharRender": true,
          "color": "rgba(0, 0, 0, 1)",
          "bold": true,
          "align": "center",
          "bgColor": "#a6a5a5",
          "borderColor": "#ffffff",
          "overflow": "hidden",
          "letterSpacing": 0,
          "padding": "2,6,2,6",
          "skin": "res://d76b07e3-3519-4c87-845d-1b21beea75ed",
          "prompt": "请输入用户名",
          "promptColor": "#686767"
        },
        {
          "_$id": "ni7de579",
          "_$type": "Image",
          "name": "Image",
          "x": 1227,
          "y": 561,
          "width": 144,
          "height": 52,
          "scaleX": 1.5,
          "scaleY": 1.5,
          "_mouseState": 2,
          "centerX": 0,
          "centerY": 0,
          "useSourceSize": true,
          "color": "#ff0000"
        },
        {
          "_$id": "x2vsmmum",
          "_$type": "Image",
          "name": "连接钱包",
          "x": 1084,
          "y": 699,
          "width": 210,
          "height": 102,
          "skin": "res://574a7c9c-8da0-4454-9f4c-0b596afd48cd@连接钱包",
          "useSourceSize": true,
          "color": "#ffffff"
        },
        {
          "_$id": "3wb4d8th",
          "_$type": "Image",
          "name": "游客体验",
          "x": 1380,
          "y": 699,
          "width": 210,
          "height": 102,
          "skin": "res://574a7c9c-8da0-4454-9f4c-0b596afd48cd@游客体验",
          "useSourceSize": true,
          "color": "#ffffff"
        },
        {
          "_$id": "k14chdpq",
          "_$type": "Image",
          "name": "window",
          "x": 994,
          "y": 401,
          "width": 719,
          "height": 563,
          "visible": false,
          "skin": "res://b736645c-6c6c-4c7e-8d89-490d0e2c67f8",
          "color": "#ffffff",
          "_$child": [
            {
              "_$id": "9ztv0uc7",
              "_$type": "Image",
              "name": "隐私服务",
              "x": 200,
              "y": 10,
              "width": 213,
              "height": 52,
              "scaleX": 1.5,
              "scaleY": 1.5,
              "top": 10,
              "centerX": 0,
              "skin": "res://574a7c9c-8da0-4454-9f4c-0b596afd48cd@隐私服务",
              "useSourceSize": true,
              "color": "#000000"
            },
            {
              "_$id": "b6wrpk91",
              "_$type": "Image",
              "name": "服务条款",
              "x": 255,
              "y": 84,
              "width": 210,
              "height": 102,
              "centerX": 0,
              "skin": "res://574a7c9c-8da0-4454-9f4c-0b596afd48cd@服务条款",
              "useSourceSize": true,
              "color": "#ffffff"
            },
            {
              "_$id": "b35bbdhd",
              "_$type": "Image",
              "name": "隐私条款",
              "x": 255,
              "y": 200,
              "width": 210,
              "height": 102,
              "centerX": 0,
              "skin": "res://574a7c9c-8da0-4454-9f4c-0b596afd48cd@隐私条款",
              "useSourceSize": true,
              "color": "#ffffff"
            },
            {
              "_$id": "xhct63er",
              "_$type": "Image",
              "name": "许可协议",
              "x": 255,
              "y": 316,
              "width": 210,
              "height": 102,
              "centerX": 0,
              "skin": "res://574a7c9c-8da0-4454-9f4c-0b596afd48cd@许可协议",
              "useSourceSize": true,
              "color": "#ffffff"
            },
            {
              "_$id": "zqo7l9bj",
              "_$type": "Image",
              "name": "不同意",
              "x": 459,
              "y": 411,
              "width": 210,
              "height": 102,
              "right": 50,
              "bottom": 50,
              "skin": "res://574a7c9c-8da0-4454-9f4c-0b596afd48cd@不同意",
              "useSourceSize": true,
              "color": "#ffffff"
            },
            {
              "_$id": "umeykjhc",
              "_$type": "Image",
              "name": "同意",
              "x": 50,
              "y": 411,
              "width": 210,
              "height": 102,
              "left": 50,
              "bottom": 50,
              "skin": "res://574a7c9c-8da0-4454-9f4c-0b596afd48cd@同意",
              "useSourceSize": true,
              "color": "#ffffff"
            }
          ]
        }
      ]
    },
    {
      "_$id": "nm8iqnfl",
      "_$type": "Image",
      "name": "设置按钮",
      "x": 2255,
      "y": 100,
      "width": 315,
      "height": 153,
      "right": 100,
      "top": 100,
      "skin": "res://5e95be6b-617c-4f21-9f90-3d37e3a4f0d5@设置.png",
      "color": "#ffffff"
    }
  ]
}