/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
}

CommonEventsDatas* GameDatas::commonEventsDatas() const {
    return m_commonEventsDatas;
}

VariablesDatas* GameDatas::variablesDatas() const {
    return m_variablesDatas;
}

SystemDatas* GameDatas::systemDatas() const {
    return m_systemDatas;
}

BattleSystemDatas* GameDatas::battleSystemDatas() const {
    return m_battleSystemDatas;
}

ItemsDatas* GameDatas::itemsDatas() const {
    return m_itemsDatas;
}

SkillsDatas* GameDatas::skillsDatas() const {
    return m_skillsDatas;
}

WeaponsDatas* GameDatas::weaponsDatas() const {
    return m_weaponsDatas;
}

ArmorsDatas* GameDatas::armorsDatas() const {
    return m_armorsDatas;
}

HeroesDatas* GameDatas::heroesDatas() const {
    return m_heroesDatas;
}

MonstersDatas* GameDatas::monstersDatas() const {
    return m_monstersDatas;
}

TroopsDatas* GameDatas::troopsDatas() const {
    return m_troopsDatas;
}

ClassesDatas* GameDatas::classesDatas() const {
    return m_classesDatas;
}

TilesetsDatas* GameDatas::tilesetsDatas() const {
    return m_tilesetsDatas;
}

AnimationsDatas* GameDatas::animationsDatas() const {
    return m_animationsDatas;
}

StatusDatas* GameDatas::statusDatas() const {
    return m_statusDatas;
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
    m_battleSystemDatas->setDefault();
    m_itemsDatas->setDefault();
    m_skillsDatas->setDefault();
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
    m_tilesetsDatas->setDefault();
    m_animationsDatas->setDefault();
    m_statusDatas->setDefault();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void GameDatas::read(QString path){
    readVariablesSwitches(path);
    m_commonEventsDatas->read(path);
    readSystem(path);
    m_itemsDatas->read(path);
    m_skillsDatas->read(path);
    m_battleSystemDatas->read(path);
    m_weaponsDatas->read(path);
    m_armorsDatas->read(path);
    m_heroesDatas->read(path);
    m_monstersDatas->read(path);
    m_troopsDatas->read(path);
    m_classesDatas->read(path);
    readTilesets(path);
    readAnimations(path);
    readStatus(path);

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

void GameDatas::readSkills(QString path) {
    m_skillsDatas->read(path);
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

void GameDatas::write(QString path){
    RPM::writeJSON(Common::pathCombine(path, RPM::pathCommonEvents),
                     *m_commonEventsDatas);
    RPM::writeJSON(Common::pathCombine(path, RPM::pathVariables),
                     *m_variablesDatas);
    writeSystem(path);
    writeBattleSystem(path);
    RPM::writeJSON(Common::pathCombine(path, RPM::pathItems),
                     *m_itemsDatas);
    writeSkills(path);
    RPM::writeJSON(Common::pathCombine(path, RPM::pathWeapons),
                     *m_weaponsDatas);
    RPM::writeJSON(Common::pathCombine(path, RPM::pathArmors),
                     *m_armorsDatas);
    RPM::writeJSON(Common::pathCombine(path, RPM::pathHeroes),
                     *m_heroesDatas);
    RPM::writeJSON(Common::pathCombine(path, RPM::pathMonsters),
                     *m_monstersDatas);
    RPM::writeJSON(Common::pathCombine(path, RPM::pathTroops),
                     *m_troopsDatas);
    RPM::writeJSON(Common::pathCombine(path, RPM::pathClasses),
                     *m_classesDatas);
    writeTilesets(path);
    writeAnimations(path);
    writeStatus(path);
}

// -------------------------------------------------------

void GameDatas::writeTilesets(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::PATH_TILESETS),
        *m_tilesetsDatas);
}

// -------------------------------------------------------

void GameDatas::writeSystem(QString path){
    RPM::writeJSON(Common::pathCombine(path, RPM::pathSystem),
        *m_systemDatas);
}

// -------------------------------------------------------

void GameDatas::writeBattleSystem(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::pathBattleSystem),
        *m_battleSystemDatas);
}

// -------------------------------------------------------

void GameDatas::writeSkills(QString path) {
    RPM::writeJSON(Common::pathCombine(path, RPM::pathSkills),
        *m_skillsDatas);
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
