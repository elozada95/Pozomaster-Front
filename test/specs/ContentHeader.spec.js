import test from 'ava'
import { mount } from '@vue/test-utils'
import ContentHeader from '../../components/ContentHeader'

let wrapper

const title = "new title"
const sdbar = "new sdbar"

test.beforeEach(() => {
  wrapper = mount(ContentHeader, {
    propsData: { title },
  })
})

test('test test', t => {
	t.pass();
});

test('ContentHeader.vue shapshow', (t) => {
  t.snapshot({ html: wrapper.html() })
})

test('Renders props.title when passed', t => {
  t.is(wrapper.text(), title)
})
