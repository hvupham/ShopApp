import {
    IsString, 
    IsNotEmpty, 
    IsPhoneNumber,     
} from 'class-validator';

export class InsertCommentDTO {
    @IsNotEmpty()
    productId: number;

    @IsString()
    @IsNotEmpty()
    content: String;



    userId: number;
    
    constructor(data: any) {
        this.productId = data.productId;
        this.content = data.content;
        this.userId = data.user.id;
    }
}