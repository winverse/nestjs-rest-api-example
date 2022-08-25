import type { LoggedUserData } from '@module/users/users.interface';
import {
  DUPLICATED_EMAIL,
  DUPLICATED_USERNAME,
  LOGIN_INFORMATION_NOT_MATCH,
} from '@constants/errors/errors.constants';
import { AuthLoginBodyDto, AuthRegisterBodyDto } from '@module/auth/dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '@module/users/users.service';
import { UtilsService } from '@provider/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly utils: UtilsService,
  ) {}
  async register(body: AuthRegisterBodyDto): Promise<LoggedUserData> {
    try {
      const { email, username, password } = body;

      const emailExists = await this.usersService.checkExistsUser(
        email,
        'email',
      );

      if (emailExists) {
        throw new ConflictException(DUPLICATED_EMAIL);
      }

      const usernameExists = await this.usersService.checkExistsUser(
        username,
        'username',
      );

      if (usernameExists) {
        throw new ConflictException(DUPLICATED_USERNAME);
      }

      const hashedPassword = await this.utils.hashGenerate(password);

      const user = await this.usersService.createUser(
        username,
        email,
        hashedPassword,
      );

      const loggedUserData = await this.usersService.getLoggedUserData(user.id);

      return loggedUserData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async login(body: AuthLoginBodyDto): Promise<LoggedUserData> {
    try {
      const { email, password: plainPassword } = body;

      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new NotFoundException(LOGIN_INFORMATION_NOT_MATCH);
      }

      const isMatch = await this.utils.hashCompare(
        plainPassword,
        user.password,
      );

      if (!isMatch) {
        throw new ConflictException(LOGIN_INFORMATION_NOT_MATCH);
      }

      const loggedUserData = await this.usersService.getLoggedUserData(user.id);

      return loggedUserData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
