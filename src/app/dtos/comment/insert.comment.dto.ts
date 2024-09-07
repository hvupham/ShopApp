import {
    IsString, 
    IsNotEmpty, 
    IsPhoneNumber,     
} from 'class-validator';

export class InsertCommentDTO {
    @IsNotEmpty()
    product_id: number;

    @IsString()
    @IsNotEmpty()
    content: String;



    user_id: number;
    
    constructor(data: any) {
        this.product_id = data.productId;
        this.content = data.content;
        this.user_id = data.user.id;
    }
}