### Git flow
1. 협업 패키지 가져오기
- git clone 원격레포

2. PullRequest까지의 흐름
<!-- 자기가 맡은 기능 구현 branch 생성하고 바로 만든 branch로 이동 -->
- git checkout -b feature/기능명 
<!-- 자기가 생성한 feature/기능명 로컬 branch와 원격 branch를 연결 시켜줌 한번 이렇게 push를 하면 다음 부터는 git 
push만 해도 반영됨-->
- git push -u origin feature/기능명 
- 원격 repo에서 Compare & Pull Request 버튼을 클릭
- 제목과 수정내용들을 입력후 Create Pull Request 버튼 클릭
<!-- 관리자만 Merge Pull Request하도록 합니다-->
- Merge Pull Request 버튼을 클릭하게 되면 merge가 완료됨 
- 


3. PullRequest가 merge 되었을 때
<!-- 맡은 기능 구현이 끝났다면 로컬 작업환경에서 다시 branch 방향을 develop으로 변경 이후 2번 작업을 반복하면 됨-->
- Merge pull Request가 완료되면 관리하는 사람이 다른 사람들에게 pull을 하라고 알려 줌
- 알림을 받으면 현재 작업중인 branch에서 git commit으로 커밋
- git checkout develop으로 branch 변경후 git pull origin develop로 최신 데이터 가져오기
- git checkout feature/기능명으로 자기가 작업하던 branch로 접속
- git merge develop으로 자신이 작업하던 데이터를 최신화 시킴



4. git 명렁어 축약
C:\사용자\유저이름의 .gitconfig에 밑의 설정을 복붙하면 축약어를 사용할수있음
[alias]
    st = status 
    cm = commit
    co = checkout
    br = branch
    sw = switch
    lg = log --oneline --graph --all --decorate
    pl = pull
    ps = push
    ft = fetch