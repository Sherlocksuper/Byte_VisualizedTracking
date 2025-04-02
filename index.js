const rootElement = document.documentElement

const key = 'data-testid'
const tooltipPositionStore = []

// 其他：
// 和窗口边缘碰撞时候，会流出来10px的留白
const windowWhiteSpace = 10


const hasDataTestId = (node) => {
    if (node instanceof HTMLElement) {
        return node.hasAttribute(key)
    }
    return false
}

// targetElement: data-testid所在的元素
// 这里需要检查是否:
// 1. 和其他date-TestId碰撞
// 2. 和边缘碰撞
// 规则：
// 1. 和tooltip碰撞的话，高度升高
// 2. 和左右边缘碰撞的话，向相反的方向移动
const getTopAndLeftImpl = (targetElement, tooltip) => {
    const dataTestId = targetElement.getAttribute(key)
    const rect = targetElement.getBoundingClientRect()

    // tooltip的位置信息
    let top = rect.top + window.scrollY
    let left = rect.right + window.scrollX
    const width = tooltip.offsetWidth
    const height = tooltip.offsetHeight

    const windowLeft = windowWhiteSpace
    const windowRight = window.innerWidth - windowWhiteSpace

    // 检测是否和已有的tooltip碰撞
    for (let i = 0; i < tooltipPositionStore.length; i++) {
        const existingPosition = tooltipPositionStore[i];
        const existingTop = existingPosition.top;
        const existingLeft = existingPosition.left;
        const existingWidth = existingPosition.width;
        const existingHeight = existingPosition.height;

        const isCollide = () => {
            return !(top + height <= existingTop ||
                existingTop + existingHeight <= top ||
                left + width <= existingLeft ||
                existingLeft + existingWidth <= left);
        }

        if (isCollide()) {
            // 发生碰撞，修改position，这里简单示例向下移动10px
            console.log('self 碰撞了')
            top -= 10;
            // 这里减去1是为了重新检查碰撞
            i -= 1;
        }
    }

    //检测是否和左右边缘碰撞
    while (true) {
        // TODO: 此处不考虑左右滑动的界面,后续添加
        if (windowRight - windowLeft < width) break;

        if (left >= windowLeft && left + width <= windowRight)break;

        if (left < windowLeft) {
            left += 10
        } else if (left + width > windowLeft){
            left -= 10
        }
    }

    return { dataTestId, top, left , width, height}
}

const getTopAndLeft = (targetElement,tooltip) => {
    const position = getTopAndLeftImpl(targetElement, tooltip);
    tooltipPositionStore.push(position)
    return position
}


const processOneElement = (node) => {
    if (node.childNodes.length >= 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
            processOneElement(node.childNodes[i])
        }
    }

    if (hasDataTestId(node)) {
        const element = node;
        const dataTestId = element.getAttribute(key);


        if (dataTestId) {
            const tooltip = document.createElement('div');
            tooltip.textContent = dataTestId;
            tooltip.style.display = 'block';
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = 'yellow';
            tooltip.style.padding = '2px';
            tooltip.style.zIndex = '1000';
            // 内容只在一行
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.overflow= "hidden";
            tooltip.style.textOverflow = 'ellipsis';

            // 先隐藏
            tooltip.style.visibility = 'hidden';

            document.body.appendChild(tooltip);

            element.addEventListener('mouseover', () => {
                const { top, left } = getTopAndLeft(element, tooltip)
                tooltip.style.top = `${top}px`;
                tooltip.style.left = `${left}px`;
                tooltip.style.visibility = 'visible'
            });

            element.addEventListener('mouseout', () => {
                tooltip.style.visibility = 'hidden';
                // 找到并删除当前tooltip的位置信息,根据dataTestId
                for (let i = 0; i < tooltipPositionStore.length; i++) {
                    if (tooltipPositionStore[i].dataTestId === dataTestId) {
                        tooltipPositionStore.splice(i, 1);
                        break;
                    }
                }
            });
        }
    }
}

processOneElement(rootElement)
