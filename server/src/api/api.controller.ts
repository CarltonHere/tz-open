import { Controller, Post, Body, Logger, Get, Req } from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@ApiBearerAuth()
@Controller('api')
export class ApiController {
  private readonly logger = new Logger(ApiController.name);
  constructor(private readonly apiService: ApiService) {}
  @Post()
  create(@Body() createApiDto: CreateApiDto) {
    return this.apiService.create(createApiDto);
  }

  @Get(':symbol')
  getBySymbol(@Req() request: Request) {
    return this.apiService.findOne(request.params.symbol);
  }

  @Get()
  findAll() {
    return {
      success: true,
      data: {
        data: [
          {
            id: 1,
            uuid: 'AA51F5DC-47d4-c1d6-2F29-A1cDfF839351',
            name: '天眼查',
            describe: '天眼查提供股权结构基本信息等工商接口服务。',
            price: 20,
            provider: 'Mark Wilson',
            status: '0',
            balance: 72,
            pay_url: 'cid://iwledyuvpi.va/ropkgys',
            create_time: '2008-05-12 04:24:42',
            update_time: '1996-08-11 07:48:08',
          },
          {
            id: 2,
            uuid: '5fa7A8d2-bC31-D4b3-68ec-8a66FACCe1e0',
            name: '银行卡核查',
            describe: '根据银行卡号核查身份证、手机号是否正确。',
            price: 10,
            provider: 'Susan Walker',
            status: '1',
            balance: 68,
            pay_url: 'tn3270://smqmygtc.ye/vlrvqegzrc',
            create_time: '1995-07-17 00:18:38',
            update_time: '1977-05-02 19:20:47',
          },
          {
            id: 3,
            uuid: '9912d2E1-C453-31B3-F34e-E6cBc7c489c2',
            name: '发票核查',
            describe: '根据发票号码核查金额、日期、交易内容等是否真实。',
            price: 82,
            provider: 'Thomas Jackson',
            status: '0',
            balance: 49,
            pay_url: 'prospero://mgdfnsimt.cc/kxrfyi',
            create_time: '1977-05-20 03:11:01',
            update_time: '1999-04-23 20:34:52',
          },
          {
            id: 4,
            uuid: 'e890B71B-e1bb-3FFA-6B1B-E7EbCBA16bBd',
            name: '手机号核查',
            describe: '根据手机号核查身份证号、归属地是否正确。',
            price: 65,
            provider: 'Jason Lewis',
            status: '1',
            balance: 65,
            pay_url: 'cid://iwdhhgj.az/gjsobng',
            create_time: '1991-07-30 03:46:29',
            update_time: '2015-08-25 17:12:12',
          },
          {
            id: 5,
            uuid: '79df7D2f-0C83-fFb6-eF4b-2f2bc2E65826',
            name: '银行卡归属地查询',
            describe: '根据银行卡查询归属地。',
            price: 83,
            provider: 'Anthony Lee',
            status: '0',
            balance: 33,
            pay_url: 'nntp://zybhoqn.qa/vgpeusjqf',
            create_time: '1983-07-18 07:05:20',
            update_time: '2004-01-26 20:21:32',
          },
          {
            id: 6,
            uuid: 'D8Ef224D-0594-2EBE-5Bef-FDfF0E688da3',
            name: '手机归属地查询',
            describe: '根据手机号查询手机归属地。',
            price: 29,
            provider: 'Daniel Harris',
            status: '0',
            balance: 90,
            pay_url: 'http://gudpmopot.net.cn/djygifcrt',
            create_time: '2001-06-19 08:40:34',
            update_time: '1982-01-14 00:23:19',
          },
          {
            id: 7,
            uuid: 'ab696Ee3-F25c-fAA9-9692-F5426DC2e835',
            name: 'IP地址位置查询',
            describe: '根据IP地址查询大致位置。',
            price: 82,
            provider: 'Dorothy Moore',
            status: '1',
            balance: 28,
            pay_url: 'news://birutpzzxe.museum/ubbji',
            create_time: '1997-09-15 04:15:06',
            update_time: '1983-09-10 23:41:03',
          },
          {
            id: 8,
            uuid: '2C71bE6D-ee0f-1EBE-9CEd-F7c5A94BAE40',
            name: '驾驶证、行驶证核查',
            describe: '核查驾驶证、行驶证是否真实。',
            price: 6,
            provider: 'Sandra Robinson',
            status: '1',
            balance: 19,
            pay_url: 'prospero://njluahfws.eh/nmqteq',
            create_time: '2009-08-29 17:40:43',
            update_time: '1987-10-20 03:37:25',
          },
          {
            id: 9,
            uuid: 'D4eAE9F6-4BAd-1e28-7b4C-AAA85FAfE724',
            name: 'Michael Garcia',
            describe:
              '住信该两术资将而数史切圆半想但断系。解省平象见深格价军住红即太做变始。',
            price: 78,
            provider: 'Michael Garcia',
            status: '0',
            balance: 16,
            pay_url: 'cid://pkim.hr/rgkv',
            create_time: '1999-07-14 17:02:11',
            update_time: '2013-09-20 12:22:24',
          },
          {
            id: 10,
            uuid: '8F4C7DFb-1c92-fD81-5F39-bbBA029F1c6a',
            name: 'Eric Johnson',
            describe: '分济往积打全矿与周线响光题。',
            price: 98,
            provider: 'Eric Johnson',
            status: '1',
            balance: 87,
            pay_url: 'cid://elu.pro/pzhuxhh',
            create_time: '2005-09-20 05:40:46',
            update_time: '1999-03-25 11:51:22',
          },
          {
            id: 11,
            uuid: 'B7eaCD76-E80A-63Ef-CF7E-fcA9e4fd8Dac',
            name: 'Gary Gonzalez',
            describe: '关关放层亲原月求农里政开件或研满表。',
            price: 22,
            provider: 'Gary Gonzalez',
            status: '0',
            balance: 20,
            pay_url: 'mid://rnjhyxdpgf.bn/ucpye',
            create_time: '1995-05-04 05:21:58',
            update_time: '1993-08-25 21:43:00',
          },
          {
            id: 12,
            uuid: '8652D48f-C4cC-B7de-436C-Bc77E199C99C',
            name: 'Kevin Perez',
            describe:
              '调毛没内在加西金则取需步改文。劳下已程主走此情应战眼它局。还华例半格连五提期级音厂只压易更代。',
            price: 33,
            provider: 'Kevin Perez',
            status: '0',
            balance: 51,
            pay_url: 'news://hkhdz.nt/masgf',
            create_time: '1975-09-10 07:33:17',
            update_time: '1972-12-02 09:51:23',
          },
          {
            id: 13,
            uuid: 'dB3BAC33-23DB-27d3-e4B3-FbCe1De569ec',
            name: 'Susan Hall',
            describe:
              '须派达正须面时布做上区不。具物位道县行通期五手容热问法把整老。',
            price: 78,
            provider: 'Susan Hall',
            status: '1',
            balance: 15,
            pay_url: 'wais://spix.ag/sxbmong',
            create_time: '2009-05-13 23:10:49',
            update_time: '1972-06-17 16:27:08',
          },
          {
            id: 14,
            uuid: '9Df9219B-B242-999B-56F9-Cc9Ac1D9B6eF',
            name: 'Nancy Garcia',
            describe:
              '对志难单史农热点因打两光外北新理连分。历不准口所日青方生加都影新完克决。局局物事群法参单题目政毛往各。',
            price: 47,
            provider: 'Nancy Garcia',
            status: '1',
            balance: 91,
            pay_url: 'wais://fvgxllwnl.qa/ilwcidx',
            create_time: '1990-11-22 20:31:05',
            update_time: '1975-06-09 21:17:39',
          },
          {
            id: 15,
            uuid: 'FB50b048-ce8F-CFF8-C4BD-5aAd0D347b14',
            name: 'Laura Lee',
            describe:
              '型按角机代验你去层合大置东至高学。统图府计土九但太非花满型科克际毛。',
            price: 93,
            provider: 'Laura Lee',
            status: '1',
            balance: 46,
            pay_url: 'mid://ocsd.jm/rvbd',
            create_time: '2001-05-02 22:52:33',
            update_time: '1976-09-26 01:31:04',
          },
          {
            id: 16,
            uuid: '1Db75Cb6-f379-5A62-1cec-e3cC88ef2bE2',
            name: 'Anthony Thompson',
            describe:
              '完多后持开东中气且角体一。正十广济出法按厂发回些上必心。',
            price: 85,
            provider: 'Anthony Thompson',
            status: '1',
            balance: 55,
            pay_url: 'prospero://fpsbfoe.ky/zfbrw',
            create_time: '1973-10-27 02:10:44',
            update_time: '2020-09-17 04:19:54',
          },
          {
            id: 17,
            uuid: '1c45bB4d-6e8d-e1CD-BE44-Ad8e874CEfA9',
            name: 'Mary Taylor',
            describe: '圆活重党系老需支门文广接线红四气要即。',
            price: 77,
            provider: 'Mary Taylor',
            status: '1',
            balance: 97,
            pay_url: 'news://ttqdiap.gd/zslgzt',
            create_time: '2010-02-16 08:47:22',
            update_time: '1977-01-22 01:30:42',
          },
          {
            id: 18,
            uuid: '8D9B3ff3-829F-49cF-DeC3-1A271E633AaA',
            name: 'Amy Clark',
            describe: '约公教军合入命号而是子作去每包制北或。',
            price: 94,
            provider: 'Amy Clark',
            status: '1',
            balance: 35,
            pay_url: 'mid://egkjbtfuw.cg/xcengkexbr',
            create_time: '2016-04-07 23:59:16',
            update_time: '2018-05-26 10:48:31',
          },
          {
            id: 19,
            uuid: '675C1bF5-AFCB-9fCF-34a3-5bf2BDBBe729',
            name: 'Margaret Smith',
            describe: '即引党好与多设局所算情看。',
            price: 99,
            provider: 'Margaret Smith',
            status: '0',
            balance: 63,
            pay_url: 'gopher://xmn.mz/ppcyc',
            create_time: '2015-05-27 04:26:53',
            update_time: '2019-06-20 07:45:04',
          },
          {
            id: 20,
            uuid: '3D4f5bfE-6F37-34Df-6DF6-Cc8554d368fE',
            name: 'Jason Davis',
            describe: '老车手压制规复里装西看达现。花科治料自提及百周集府养。',
            price: 32,
            provider: 'Jason Davis',
            status: '0',
            balance: 72,
            pay_url: 'cid://xxrbhhszq.cr/hqqmn',
            create_time: '2002-12-30 11:56:06',
            update_time: '2020-10-03 06:14:52',
          },
        ],
      },
      errorCode: 0,
      errorMessage: '',
      showType: 2,
    };
  }
}
