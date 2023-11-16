import React from 'react'
import { mock, instance } from 'ts-mockito'

import { render } from 'uiSrc/utils/test-utils'
import { useDisposableWebworker } from 'uiSrc/services'
import VirtualTree, { Props } from './VirtualTree'

const mockedProps = mock<Props>()

const mockedItems = [
  {
    name: 'test',
    type: 'hash',
    ttl: 2147474450,
    size: 3041,
  },
]

const mockTreeItem = {
  children: [{
    children: [],
    fullName: 'car:110:',
    id: '0.snc1rc3zwgo',
    keyApproximate: 0.01,
    keyCount: 1,
    name: '110',
  }],
  fullName: 'car:',
  id: '0.sz1ie1koqi8',
  keyApproximate: 47.18,
  keyCount: 4718,
  name: 'car',
}

const mockTreeItem2 = {
  children: [],
  fullName: 'test',
  id: '0.snc1rc3zwg1o',
  keyApproximate: 0.01,
  keyCount: 1,
  name: 'test',
}

export const mockVirtualTreeResult = [mockTreeItem, mockTreeItem2]

jest.mock('uiSrc/services', () => ({
  ...jest.requireActual('uiSrc/services'),
  __esModule: true,
  useDisposableWebworker: jest.fn(() => ({ result: mockVirtualTreeResult, run: jest.fn() }))
}))

describe('VirtualTree', () => {
  it('should render with empty nodes', () => {
    expect(render(<VirtualTree {...instance(mockedProps)} />)).toBeTruthy()
  })

  it('should render Spinner with empty nodes and loading', () => {
    const mockFn = jest.fn()
    const { queryByTestId } = render(
      <VirtualTree
        {...instance(mockedProps)}
        loading
        setConstructingTree={mockFn}
      />
    )

    expect(queryByTestId('virtual-tree-spinner')).toBeInTheDocument()
  })

  it('should render items', async () => {
    const mockFn = jest.fn()
    const { queryByTestId } = render(
      <VirtualTree
        {...instance(mockedProps)}
        items={mockedItems}
        setConstructingTree={mockFn}
      />
    )

    expect(queryByTestId('node-item_test')).toBeInTheDocument()
  })

  it('should call onStatusOpen if only one folder is exist', () => {
    (useDisposableWebworker as jest.Mock).mockReturnValueOnce({
      result: [mockTreeItem],
      run: jest.fn()
    })
    const mockFn = jest.fn()
    const mockOnStatusOpen = jest.fn()

    render(
      <VirtualTree
        {...instance(mockedProps)}
        onStatusOpen={mockOnStatusOpen}
        setConstructingTree={mockFn}
      />
    )

    expect(mockOnStatusOpen).toBeCalledWith('car:', true)
  })

  it('should not call onStatusOpen if more then one folder is exist', () => {
    const mockFn = jest.fn()
    const mockOnStatusOpen = jest.fn()

    render(
      <VirtualTree
        {...instance(mockedProps)}
        onStatusOpen={mockOnStatusOpen}
        setConstructingTree={mockFn}
      />
    )

    expect(mockOnStatusOpen).not.toHaveBeenCalled()
  })
})
