# 스노우맨 — 2026-09-01 수집 스냅샷 (무엇을 봤나)

- 목록: `GET https://www.snowman.co.kr/portal/chageAdtnsvc/ppdChage/list` — **서버가 그린 HTML**(194KB)
- 값: `POST https://www.snowman.co.kr/portal/chageAdtnsvc/getChageDtl` `{"chageProdSeq":"10501"}`
- `#tabsALL` 안 `popDtl('<코드>' …)` 39개 = 이 집 요금제 전부
- 원문(상세 39건)은 옆의 `all-2026-09-01-getChageDtl.json`

## 망은 KT·LGU+ 둘뿐이다

목록 화면 탭 마크업 그대로:
```html
<li id="ALL" class="active">ALL</li>
<li id="KT">KT</li>
<li id="LG">LGU+</li>
```
SKT 탭이 없다. 상세 39건의 `commCmpnCd` 분포: `{"KT":34,"LG":5}`.

## 할인 표기가 없다는 근거

목록의 호출은 39건 전부 `popDtl('<코드>', '', '00', '')`.
`chageList.js`의 `popDtl`:
```js
$('#engtMons').text( engtMons==null || engtMons=='00' ? '무약정' : engtMons + '개월 약정 ' );
// lowstChage 가 비면
$('#lowstChage').html( '월 ' + addEmTag(comma(data.basChage)) + '원' );
```
→ `engtMons='00'` = **무약정**, `lowstChage` 비어 있음 = 화면에 `basChage`가 그대로 「월 N원」으로 찍힌다.

## 일 단위 데이터가 이름에 안 나오는 경우 (⚠️ 함정)

```
10001 | KT | LTE | LTE데이터선택10G | 49390 | simplDesc: "기본제공량 소진시 일2GB 추가"
10421 | KT | LTE | 스노우맨 일5GB+5Mbps | 49500 | simplDesc: "매일 5GB씩"
10060 | LG | LTE | 통화기본 데이터매일5GB+ | 52800 | simplDesc: "매일5GB씩"
```
`LTE데이터선택10G`는 이름만 보면 월 10GB짜리다. `simplDesc`까지 봐야 걸러진다.

## 상세 응답 예 (10501 「데이터10GB+」)

```
"commCmpnCd":"KT","commSpecCd":"LTE","basChage":23100,
"basDataCpct":"10","basDataUnit":"GB","basDataUnlmtYn":"N","apdDataSpeedRstrtnUnit":"1Mbps",
"basTlkUnlmtYn":"Y","basChrUnlmtYn":"Y","chageProdGroupDivCd":"01","useYn":"Y"
```
> ◆ 기본제공량을 모두 사용한 이후에는 1Mbps속도로 데이터 이용이 가능합니다.
