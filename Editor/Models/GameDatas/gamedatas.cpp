/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "gamedatas.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

GameDatas::GameDatas() :
    m_commonEventsDatas(new CommonEventsDatas),
    m_variablesDatas(new VariablesDatas),
    m_systemDatas(new SystemDatas),
    m_battleSystemDatas(new BattleSystemDatas),
    m_itemsDatas(new ItemsDatas),
    m_skillsDatas(new SkillsDatas),
    m_weaponsDatas(new WeaponsDatas),
    m_armorsDatas(new ArmorsDatas),
    m_heroesDatas(new HeroesDatas),
    m_monstersDatas(new MonstersDatas),
    m_troopsDatas(new TroopsDatas),
    m_classesDatas(new ClassesDatas),
    m_tilesetsDatas(new TilesetsDatas),
    m_animationsDatas(new AnimationsDatas),
    m_statusDatas(new StatusDatas),
    m_titleScreenGameOverDatas(new TitleScreenGameOverDatas),
    m_isDatasRead(false)
{

}

GameDatas::~GameDatas()
{
    delete m_commonEventsDatas;
    delete m_variablesDatas;
    delete m_systemDatas;
    delete m_battleSystemDatas;
    delete m_itemsDatas;
    delete m_skillsDatas;
    delete m_weaponsDatas;
    delete m_armorsDatas;
    delete m_heroesDatas;
    delete m_monstersDatas;
    delete m_troopsDatas;
    delete m_classesDatas;
    delete m_tilesetsDatas;
    delete m_animationsDatas;
    delete m_statusDatas;
    delete m_titleScreenGameOverDatas;
}

CommonEventsDatas * GameDatas::commonEventsDatas() const {
    return m_commonEventsDatas;
}

VariablesDatas * GameDatas::variablesDatas() const {
    return m_variablesDatas;
}

SystemDatas * GameDatas::systemDatas() const {
    return m_systemDatas;
}

BattleSystemDatas * GameDatas::battleSystemDatas() const {
    return m_battleSystemDatas;
}

ItemsDatas * GameDatas::itemsDatas() const {
    return m_itemsDatas;
}

SkillsDatas * GameDatas::skillsDatas() const {
    return m_skillsDatas;
}

WeaponsDatas * GameDatas::weaponsDatas() const {
    return m_weaponsDatas;
}

ArmorsDatas * GameDatas::armorsDatas() const {
    return m_armorsDatas;
}

HeroesDatas * GameDatas::heroesDatas() const {
    return m_heroesDatas;
}

MonstersDatas * GameDatas::monstersDatas() const {
    return m_monstersDatas;
}

TroopsDatas * GameDatas::troopsDatas() const {
    return m_troopsDatas;
}

ClassesDatas * GameDatas::classesDatas() const {
    return m_classesDatas;
}

TilesetsDatas * GameDatas::tilesetsDatas() const {
    return m_tilesetsDatas;
}

AnimationsDatas * GameDatas::animationsDatas() const {
    return m_animationsDatas;
}

StatusDatas * GameDatas::statusDatas() const {
    return m_statusDatas;
}

TitleScreenGameOverDatas * GameDatas::titleScreenGameOverDatas() const {
    return m_titleScreenGameOverDatas;
}

bool GameDatas::isDatasRead() const {
    return m_isDatasRead;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void GameDatas::setDefault(){
    m_commonEventsDatas->setDefault();
    m_variablesDatas->setDefault();
    m_systemDatas->setDefault();
    setDefaultItemsCharacters();
    m_tilesetsDatas->setDefault();
    m_statusDatas->setDefault();
    m_titleScreenGameOverDatas->setDefault();
}

// -------------------------------------------------------

void GameDatas::setDefaultItemsCharacters() {
    m_itemsDatas->setDefault();
    m_skillsDatas->setDefault();
    m_battleSystemDatas->setDefault();
    m_weaponsDatas->setDefault();
    m_armorsDatas->setDefault();
    m_heroesDatas->setDefault();
    m_monstersDatas->setDefault(m_systemDatas->modelCurrencies()
                                ->invisibleRootItem(),
                                m_itemsDatas->model()->invisibleRootItem(),
                                m_weaponsDatas->model()->invisibleRootItem(),
                                m_armorsDatas->model()->invisibleRootItem());
    m_troopsDatas->setDefault(m_monstersDatas->model()->invisibleRootItem());
    m_classesDatas->setDefault(m_skillsDatas->model()->invisibleRootItem(),
                               m_battleSystemDatas->modelCommonStatistics()
                               ->invisibleRootItem());
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void GameDatas::read(QString path){
    readVariablesSwitches(path);
    readCommonEvents(path);
    readSystem(path);
    readItems(path);
    readSkills(path);
    readBattleSystem(path);
    readWeapons(path);
    readArmors(path);
    readHeroes(path);
    readMonsters(path);
    readTroops(path);
    readClasses(path);
    readTilesets(path);
    readAnimations(path);
    readStatus(path);
    readTitleScreenGameOver(path);

    m_isDatasRead = true;
}

// -------------------------------------------------------

void GameDatas::readVariablesSwitches(QString path){
    m_variablesDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::readTilesets(QString path) {
    m_tilesetsDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::readSystem(QString path){
    m_systemDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::readBattleSystem(QString path) {
    m_battleSystemDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::readItems(QString path) {
    m_itemsDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::readSkills(QString path) {
    m_skillsDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::readWeapons(QString path) {
    m_weaponsDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::readArmors(QString path) {
    m_armorsDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::readHeroes(QString path) {
    m_heroesDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::readMonsters(QString path) {
    m_monstersDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::readTroops(QString path) {
    m_troopsDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::readClasses(QString path) {
    m_classesDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::readAnimations(QString path) {
    m_animationsDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::readStatus(QString path) {
    m_statusDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::readTitleScreenGameOver(QString path) {
    m_titleScreenGameOverDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::readCommonEvents(QString path) {
    m_commonEventsDatas->read(path);
}

// -------------------------------------------------------

void GameDatas::write(QString path){
    writeCommonEvents(path);
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_VARIABLES),
                     *m_variablesDatas);
    writeSystem(path);
    writeBattleSystem(path);
    writeItems(path);
    writeSkills(path);
    writeWeapons(path);
    writeArmors(path);
    writeHeroes(path);
    writeMonsters(path);
    writeTroops(path);
    writeClasses(path);
    writeTilesets(path);
    writeAnimations(path);
    writeStatus(path);
    writeTitleScreenGameOver(path);
}

// -------------------------------------------------------

void GameDatas::writeTilesets(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_TILESETS_DATAS),
        *m_tilesetsDatas);
}

// -------------------------------------------------------

void GameDatas::writeSystem(QString path){
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_SYSTEM),
        *m_systemDatas);
}

// -------------------------------------------------------

void GameDatas::writeBattleSystem(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_BATTLE_SYSTEM),
        *m_battleSystemDatas);
}

// -------------------------------------------------------

void GameDatas::writeItems(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_ITEMS), *m_itemsDatas);
}

// -------------------------------------------------------

void GameDatas::writeSkills(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_SKILLS), *m_skillsDatas);
}

// -------------------------------------------------------

void GameDatas::writeWeapons(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_WEAPONS), *m_weaponsDatas);
}

// -------------------------------------------------------

void GameDatas::writeArmors(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_ARMORS), *m_armorsDatas);
}

// -------------------------------------------------------

void GameDatas::writeHeroes(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_HEROES), *m_heroesDatas);
}

// -------------------------------------------------------

void GameDatas::writeMonsters(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_MONSTERS), *m_monstersDatas);
}

// -------------------------------------------------------

void GameDatas::writeTroops(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_TROOPS), *m_troopsDatas);
}

// -------------------------------------------------------

void GameDatas::writeClasses(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_CLASSES), *m_classesDatas);
}

// -------------------------------------------------------

void GameDatas::writeAnimations(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_ANIMATIONS),
        *m_animationsDatas);
}

// -------------------------------------------------------

void GameDatas::writeStatus(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_STATUS),
        *m_statusDatas);
}

// -------------------------------------------------------

void GameDatas::writeTitleScreenGameOver(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_TITLE_SCREEN_GAME_OVER),
        *m_titleScreenGameOverDatas);
}

// -------------------------------------------------------

void GameDatas::writeCommonEvents(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_COMMON_EVENTS),
        *m_commonEventsDatas);
}
