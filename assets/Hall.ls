{
  "_$ver": 1,
  "_$id": "mkhg9sc7",
  "_$runtime": "res://20bbf52b-3aa9-482d-9cc9-aeec28e18fc7",
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
      "_$type": "a14bacd4-ac54-4dc4-b597-c83f2d3064a4",
      "scriptPath": "../src/HallScript.ts",
      "aiRoomBtn": {
        "_$ref": "ackjbpvj"
      },
      "quickjoinRoomBtn": {
        "_$ref": "oh6d5a16"
      },
      "joinRoomBtn": {
        "_$ref": "wjce7fko"
      },
      "disconnectBtn": {
        "_$ref": "9mn0qvs4"
      },
      "address": {
        "_$ref": "qtuw5gqi"
      },
      "name": {
        "_$ref": "cju4ikih"
      },
      "settingbtn": {
        "_$ref": "twgcrlrq"
      },
      "roomTextInput": {
        "_$ref": "del74y1f"
      },
      "joinRoomDialog": {
        "_$ref": "bvm4t3md"
      },
      "joinBtn": {
        "_$ref": "jp9shfoz"
      },
      "reconnectDialog": {
        "_$ref": "v241a0m2"
      },
      "enterRoomBtn": {
        "_$ref": "4xmfmrop"
      },
      "reconnectDialogClose": {
        "_$ref": "9loy02pn"
      }
    }
  ],
  "_$child": [
    {
      "_$id": "sx1kyb58",
      "_$type": "Sprite",
      "name": "Sprite",
      "width": 2670,
      "height": 1200,
      "texture": {
        "_$uuid": "bb8c567d-43a6-4933-b438-73695c461efe",
        "_$type": "Texture"
      },
      "_mouseState": 2,
      "_$child": [
        {
          "_$id": "wjce7fko",
          "_$type": "Image",
          "name": "加入房间",
          "x": 1965,
          "y": 365,
          "width": 405,
          "height": 470,
          "right": 300,
          "centerY": 0,
          "skin": "res://f726b91c-d203-43c4-b3b1-5cd5af3643a5",
          "useSourceSize": true,
          "color": "#ffffff"
        },
        {
          "_$id": "oh6d5a16",
          "_$type": "Image",
          "name": "快速匹配",
          "x": 1132,
          "y": 370,
          "width": 406,
          "height": 460,
          "centerX": 0,
          "centerY": 0,
          "skin": "res://0856ce04-7dc7-4f81-bb5f-9afff8b7e250",
          "useSourceSize": true,
          "color": "#ffffff"
        },
        {
          "_$id": "ackjbpvj",
          "_$type": "Image",
          "name": "AI对抗",
          "x": 300,
          "y": 370,
          "width": 406,
          "height": 460,
          "left": 300,
          "centerY": 0,
          "skin": "res://1d388e2e-9c44-4052-84a2-5efb44e35b49",
          "color": "#ffffff"
        },
        {
          "_$id": "bvm4t3md",
          "_$type": "Dialog",
          "name": "joinRoom",
          "x": 668,
          "y": 300,
          "width": 1335,
          "height": 600,
          "visible": false,
          "_mouseState": 2,
          "centerX": 0,
          "centerY": 0,
          "_$child": [
            {
              "_$id": "fiaf4d4o",
              "_$type": "Image",
              "name": "bg",
              "width": 1335,
              "height": 600,
              "_mouseState": 2,
              "left": 0,
              "right": 0,
              "top": 0,
              "bottom": 0,
              "skin": "res://d19eb173-a63e-40b2-921e-62b9883bc025",
              "color": "#ffffff",
              "_$child": [
                {
                  "_$id": "0yvrxc7k",
                  "_$type": "Button",
                  "name": "close",
                  "x": 1215,
                  "width": 120,
                  "height": 120,
                  "_mouseState": 2,
                  "right": 0,
                  "top": 0,
                  "skin": "res://60a9086c-a9c2-4e01-a563-355c117b509e",
                  "label": "",
                  "labelAlign": "center",
                  "labelVAlign": "middle"
                },
                {
                  "_$id": "del74y1f",
                  "_$type": "TextInput",
                  "name": "roomNum",
                  "x": 243,
                  "y": 206,
                  "width": 850,
                  "height": 89,
                  "_mouseState": 2,
                  "centerX": 0,
                  "centerY": -50,
                  "text": "",
                  "font": "KaiTi",
                  "fontSize": 50,
                  "bold": true,
                  "align": "center",
                  "bgColor": "#a5a1a1",
                  "letterSpacing": 0,
                  "padding": "2,6,2,6",
                  "skin": "res://d76b07e3-3519-4c87-845d-1b21beea75ed",
                  "type": "number",
                  "maxChars": 9,
                  "prompt": "请输入房间号",
                  "promptColor": "#615f5f"
                },
                {
                  "_$id": "t6vrwcd0",
                  "_$type": "Text",
                  "name": "Text",
                  "x": 288,
                  "y": 51,
                  "width": 179,
                  "height": 49,
                  "scaleX": 1.5,
                  "scaleY": 1.5,
                  "text": "输入房间号",
                  "font": "KaiTi",
                  "fontSize": 40,
                  "color": "#000000",
                  "align": "center",
                  "valign": "middle",
                  "leading": 2,
                  "letterSpacing": 0
                },
                {
                  "_$id": "vdnlwqgl",
                  "_$type": "Text",
                  "name": "Text_1",
                  "x": 247,
                  "y": 303,
                  "width": 908,
                  "height": 125,
                  "text": "如果输入的房间号服务器中没有，那么将建立此房间号的新房间",
                  "font": "KaiTi",
                  "fontSize": 50,
                  "color": "#676767",
                  "bold": true,
                  "valign": "middle",
                  "wordWrap": true,
                  "leading": 2,
                  "letterSpacing": 0,
                  "shadowColor": "#fff5f5"
                },
                {
                  "_$id": "jp9shfoz",
                  "_$type": "Image",
                  "name": "joinBtn",
                  "x": 560,
                  "y": 450,
                  "width": 144,
                  "height": 70,
                  "scaleX": 1.5,
                  "scaleY": 1.5,
                  "bottom": 45,
                  "centerX": 0,
                  "skin": "res://baa8f372-a537-4672-b852-53ee19b23d7b",
                  "color": "#f70000"
                }
              ]
            }
          ]
        },
        {
          "_$id": "v241a0m2",
          "_$var": true,
          "_$type": "Dialog",
          "name": "reconnect",
          "x": 668,
          "y": 300,
          "width": 1335,
          "height": 600,
          "visible": false,
          "_mouseState": 2,
          "centerX": 0,
          "centerY": 0,
          "isModal": true,
          "_$child": [
            {
              "_$id": "22h50d4e",
              "_$type": "Image",
              "name": "bg",
              "width": 1335,
              "height": 600,
              "_mouseState": 2,
              "left": 0,
              "right": 0,
              "top": 0,
              "bottom": 0,
              "skin": "res://d19eb173-a63e-40b2-921e-62b9883bc025",
              "color": "#ffffff",
              "_$child": [
                {
                  "_$id": "a0s3iy9r",
                  "_$type": "Button",
                  "name": "close",
                  "active": false,
                  "x": 1215,
                  "width": 120,
                  "height": 120,
                  "visible": false,
                  "_mouseState": 2,
                  "right": 0,
                  "top": 0,
                  "skin": "res://60a9086c-a9c2-4e01-a563-355c117b509e",
                  "label": "",
                  "labelAlign": "center",
                  "labelVAlign": "middle"
                },
                {
                  "_$id": "i1usy0wv",
                  "_$type": "Label",
                  "name": "Label",
                  "x": 322,
                  "y": 202,
                  "width": 701,
                  "height": 210,
                  "centerX": 5,
                  "centerY": 7,
                  "text": "检测到您的牌局还未结束，是否继续牌局",
                  "font": "KaiTi",
                  "fontSize": 50,
                  "color": "#1b1a1a",
                  "bold": true,
                  "align": "center",
                  "valign": "middle",
                  "wordWrap": true,
                  "letterSpacing": 0
                },
                {
                  "_$id": "4xmfmrop",
                  "_$type": "Image",
                  "name": "yes",
                  "x": 150,
                  "y": 400,
                  "width": 172,
                  "height": 84,
                  "left": 150,
                  "skin": "res://baa8f372-a537-4672-b852-53ee19b23d7b",
                  "color": "#000000"
                },
                {
                  "_$id": "9loy02pn",
                  "_$type": "Image",
                  "name": "取消",
                  "x": 1013,
                  "y": 400,
                  "width": 172,
                  "height": 84,
                  "right": 150,
                  "skin": "res://b8341564-c2fa-4709-b6ef-d52ded699486",
                  "color": "#ff0000"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "_$id": "9ecvm1ow",
      "_$type": "Image",
      "name": "钱包地址",
      "x": 65,
      "y": 128,
      "width": 213,
      "height": 52,
      "scaleX": 1.5,
      "scaleY": 1.5,
      "skin": "res://574a7c9c-8da0-4454-9f4c-0b596afd48cd@欢迎回来",
      "useSourceSize": true,
      "color": "#ffffff",
      "_$child": [
        {
          "_$id": "qtuw5gqi",
          "_$type": "Label",
          "name": "Label",
          "x": 166,
          "y": 5,
          "width": 185,
          "height": 28,
          "scaleX": 1.5,
          "scaleY": 1.5,
          "right": -230,
          "text": "8f2c....xyzc",
          "font": "KaiTi",
          "fontSize": 28,
          "color": "#02bdff",
          "bold": true,
          "align": "center",
          "valign": "middle",
          "letterSpacing": 0,
          "underlineColor": "#ffffff"
        },
        {
          "_$id": "9mn0qvs4",
          "_$type": "Image",
          "name": "取消连接按钮",
          "x": 446,
          "y": -10,
          "width": 210,
          "height": 102,
          "scaleX": 0.8,
          "scaleY": 0.8,
          "skin": "res://574a7c9c-8da0-4454-9f4c-0b596afd48cd@取消连接按钮",
          "useSourceSize": true,
          "color": "#ffffff"
        }
      ]
    },
    {
      "_$id": "qea2o48e",
      "_$type": "Label",
      "name": "Label",
      "x": 1800,
      "y": 128,
      "width": 250,
      "height": 52,
      "scaleX": 1.5,
      "scaleY": 1.5,
      "right": 495,
      "top": 128,
      "text": "欢迎回来：",
      "font": "KaiTi",
      "fontSize": 28,
      "color": "#ffffff",
      "align": "center",
      "valign": "middle",
      "letterSpacing": 0
    },
    {
      "_$id": "cju4ikih",
      "_$type": "Label",
      "name": "Label_1",
      "x": 2100,
      "y": 128,
      "width": 250,
      "height": 52,
      "scaleX": 1.5,
      "scaleY": 1.5,
      "right": 195,
      "top": 128,
      "text": "牛逼逼逼逼逼逼逼",
      "font": "KaiTi",
      "fontSize": 30,
      "color": "#ff02c3",
      "bold": true,
      "valign": "middle",
      "letterSpacing": 0
    },
    {
      "_$id": "twgcrlrq",
      "_$type": "Image",
      "name": "设置按钮",
      "x": 1178,
      "y": 100,
      "width": 315,
      "height": 153,
      "top": 100,
      "centerX": 0,
      "skin": "res://5e95be6b-617c-4f21-9f90-3d37e3a4f0d5@设置.png",
      "color": "#ffffff"
    }
  ]
}