import _ from 'lodash';

export const createObject = (data: any) => {
    let arrayType: any = '';
    let arrayTypeMock: string = '';

    return data.reduce((r: any, { field, type, mockSize, mock }: any) => {
        var key = field;
        var value = '';

        if (mock) {
            value = mock;
        }

        if (type === '[Object]') {
            arrayType = field;
            arrayTypeMock = typeof mockSize === 'undefined' ? '' : '|' + mockSize;
        }

        if (arrayType !== '' && key.includes(arrayType)) {
            key =
                field.replace(new RegExp(`(^${arrayType})`), '$1' + arrayTypeMock + '[0]') +
                (typeof mockSize !== 'undefined' && arrayType !== field ? `|${mockSize}` : '');
        } else {
            arrayType = '';
            arrayTypeMock = '';
        }

        _.set(r, key, value);

        return r;
    }, {});
};
