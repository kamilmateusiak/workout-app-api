import { Controller, Post, HttpStatus, HttpException, Body } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { UserVm } from './models/view-models/user-vm.model';
import { getOperationId } from 'src/shared/utils/get-operation-id';
import { RegisterVm } from './models/view-models/register-vm.model';
import { LoginVm } from './models/view-models/login-vm.model';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';

@Controller('users')
@ApiUseTags(User.modelName)
export class UserController {
  constructor(private readonly _userService: UserService) {
     
  }

  @Post('register')
  @ApiResponse({status: HttpStatus.CREATED, type: UserVm})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, type: HttpException})
  @ApiOperation(getOperationId(User.modelName, 'Register'))
  async register(@Body() registerVm: RegisterVm): Promise<UserVm> {
    const { username, password } = registerVm;

    if (!username) {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }

    if (!password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }
    let exist;
    try {
      exist = await this._userService.findOne({username});
    } catch(e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    
    if (exist) {
      throw new HttpException('User exist', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this._userService.register(registerVm)
    return this._userService.map<UserVm>(newUser);
  }

  @Post('login')
  @ApiResponse({status: HttpStatus.CREATED, type: LoginResponseVm})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, type: HttpException})
  @ApiOperation(getOperationId(User.modelName, 'Login'))
  async login(@Body() loginVm: LoginVm): Promise<LoginResponseVm> {
     const fields = Object.keys(loginVm);
     fields.forEach(field => {
       if(!loginVm[field]) {
         throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST)
       }
     })

     return this._userService.login(loginVm);
  }
}
