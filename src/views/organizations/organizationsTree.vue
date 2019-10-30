<template>
<div class="custom-tree-container">
  <div class="block">
    <p>使用 render-content</p>
    <el-tree
      :data="data4"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
  </div>
  <div class="block">
    <p>使用 scoped slot</p>
    <el-tree
      :data="data5"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</div>
</template>
<script>
  let id = 1000;

  export default {
    data() {
      const data = [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
            ,items:[{'nodename':'列表','value':'list'},{'nodename':'新增','value':'add'},{'nodename':'修改','value':'modify'}]
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }];
      return {
        data4: JSON.parse(JSON.stringify(data)),
        data5: JSON.parse(JSON.stringify(data))
        ,checkList:[]
      }
    },

    methods: {
      append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },

      renderContent(h, { node, data, store }) {
        console.log(node);
        console.log(data);
        console.log(data.items);

        // return (
        //   <div
        //     // normal attributes or component props.
        //     id="foo"
        //     // DOM properties are prefixed with `domProps`
        //     domPropsInnerHTML="bar"
        //     // event listeners are prefixed with `on` or `nativeOn`
        //     onClick={this.clickHandler}
        //     nativeOnClick={this.nativeClickHandler}
        //     // other special top-level properties
        //     class={{ foo: true, bar: false }}
        //     style={{ color: 'red', fontSize: '14px' }}
        //     key="key"
        //     ref="ref"
        //     // assign the `ref` is used on elements/components with v-for
        //     refInFor
        //     slot="slot">
        //   </div>
        // );

        // return (
        //   <span class="custom-tree-node">
        //     <span>{node.label}</span>
        //     <span>
        //       <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
        //       <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
        //       <el-checkbox v-model="checked">备选项</el-checkbox>
        //     </span>
        //   </span>);

        return h('span',{class: { 'custom-tree-node': true }},
          [ 
            h('span',[node.label])
            ,h('span',  
              data.items 
              ?
              h('span', data.items.map(function (item) {
                  console.log(item.nodename);
                  h('span', [item.nodename]);
                })
              )
              :
              [node.label]
            )
          ] 
        );
      }
    }
  };
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
