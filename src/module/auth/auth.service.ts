import { LoggedUserData } from '@module/users/users.interface';
import {
  DUPLICATED_EMAIL,
  DUPLICATED_USERNAME,
  LOGIN_INFORMATION_NOT_MATCH,
} from '@constants/errors/errors.constants';
import { AuthLoginBodyDto, AuthRegisterBodyDto } from '@module/auth/dto';
import { UsersService } from '@module/users/users.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@provider/prisma';
import { UtilsService } from '@provider/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly prismaService: PrismaService,
    private readonly utils: UtilsService,
  ) {}
  async register(body: AuthRegisterBodyDto): Promise<LoggedUserData> {
    try {
      const { email, username, password } = body;

      const emailExists = await this.userService.checkExistsUser(
        email,
        'email',
      );

      if (emailExists) {
        throw new ConflictException(DUPLICATED_EMAIL);
      }

      const usernameExists = await this.userService.checkExistsUser(
        username,
        'username',
      );

      if (usernameExists) {
        throw new ConflictException(DUPLICATED_USERNAME);
      }

      const hashedPassword = await this.utils.hashGenerate(password);

      const user = await this.userService.createUser(
        username,
        email,
        hashedPassword,
      );

      const loggedUserData = await this.userService.getLoggedUserData(user.id);

      return loggedUserData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async login(body: AuthLoginBodyDto): Promise<LoggedUserData> {
    try {
      const { email, password: plainPassword } = body;

      const user = await this.userService.findByEmail(email);

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

      const loggedUserData = await this.userService.getLoggedUserData(user.id);

      return loggedUserData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
