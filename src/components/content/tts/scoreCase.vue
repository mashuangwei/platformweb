<template>
  <div>
    <!--<Card>-->
      <!--<p slot="title">-->
        <!--<Icon type="ios-keypad"></Icon>-->
        <!--系统{{data.index}}-->
      <!--</p>-->
      <row>
        <i-col span="3" offset="1">
          <div style="margin-top: 7px; text-align: right; "><label style="color: black">语音：</label></div>
        </i-col>
        <i-col span="4" style="margin-left: 15px;width: 250px">
          <audio :src="data.url" controls="controls" >
          </audio>
        </i-col>
      </row>
      <br>

      <row v-if="data.naturalness !== undefined">
        <i-col span="3" offset="1">
          <div style="margin-top: 7px; text-align: right;"><label style="color: black">自然度：</label></div>
        </i-col>
        <i-col span="4" style="margin-left: 15px">
          <div>
            <Select v-model="data.naturalness" @on-change="selectNaturalness" style="width: 200px">
              <Option v-for="item in scoreOptions"  :key="item.value" :value="item.value">{{item.value}}</Option>
            </Select>
          </div>
        </i-col>
      </row>
      <br>
      <row v-if="data.soundQuality !== undefined">
        <i-col span="3" offset="1">
          <div style="margin-top: 7px; text-align: right;"><label style="color: black">音质：</label></div>
        </i-col>
        <i-col span="4" style="margin-left: 15px">
          <div>
            <Select v-model="data.soundQuality" @on-change="selectSoundQuality" style="width: 200px">
              <Option v-for="item in scoreOptions"  :key="item.value" :value="item.value">{{item.value}}</Option>
            </Select>
          </div>
        </i-col>
      </row>
      <br>

      <row v-if="data.wholeFeel !== undefined">
        <i-col span="3" offset="1">
          <div style="margin-top: 7px; text-align: right;"><label style="color: black">总体感觉：</label></div>
        </i-col>
        <i-col span="4" style="margin-left: 15px">
          <div>
            <Select v-model="data.wholeFeel" @on-change="selectWholeFeel" style="width: 200px">
              <Option v-for="item in scoreOptions"  :key="item.value" :value="item.value">{{item.value}}</Option>
            </Select>
          </div>
        </i-col>
      </row>
      <br>
      <div class="border-bt editor-wrap">
      </div>
      <br>

    <!--</Card>-->
  </div>
</template>

<script>
  import Row from 'iview/src/components/grid/row'

  export default {
    components: {Row},
    props: {
      data: Object
    },
    data () {
      return {
        naturalness: 1,
        soundQuality: 1,
        wholeFeel: 1,
        scoreOptions: [
          {
            value: 1
          },
          {
            value: 1.5
          },
          {
            value: 2
          },
          {
            value: 2.5
          },
          {
            value: 3
          },
          {
            value: 3.5
          },
          {
            value: 4
          },
          {
            value: 4.5
          },
          {
            value: 5
          }
        ]
      }
    },
    created () {
    },
    methods: {
      updateSystemScore () {
        this.$emit('update', this.data)
      },
      selectNaturalness (score) {
        this.data.naturalness = score
        this.$emit('update', this.data)
      },
      selectWholeFeel (score) {
        this.data.wholeFeel = score
        this.$emit('update', this.data)
      },
      selectSoundQuality (score) {
        this.data.soundQuality = score
        this.$emit('update', this.data)
      }
    }
  }
</script>

<style>
</style>
