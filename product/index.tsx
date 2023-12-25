import React, { type FC } from 'react';

const Product: FC<{ title: string }> = (props) => <h4>{props.title}</h4>;

export default Product;
