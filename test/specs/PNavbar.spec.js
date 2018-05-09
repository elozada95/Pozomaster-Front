import test from 'ava'
import { mount } from '@vue/test-utils'
import PNavbar from '../../components/PNavbar'

let wrapper = mount(PNavbar)

test('test test', t => {
	t.pass();
});

test('PNavbar.vue snapshot', (t) => {
	t.snapshot({ html : wrapper.html() })
})