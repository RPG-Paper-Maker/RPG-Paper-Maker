/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "langsdatas.h"
#include "rpm.h"
#include "common.h"
#include "systemlanguage.h"

const QString LangsDatas::JSON_LANGS = "langs";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

LangsDatas::LangsDatas() :
    m_model(new QStandardItemModel),
    m_loadAGame(new SystemTranslatable),
    m_loadAGameDescription(new SystemTranslatable),
    m_slot(new SystemTranslatable),
    m_empty(new SystemTranslatable),
    m_saveAGame(new SystemTranslatable),
    m_saveAGameDescription(new SystemTranslatable),
    m_keyboardAssignment(new SystemTranslatable),
    m_keyboardAssignmentDescription(new SystemTranslatable),
    m_keyboardAssignmentSelectedDescription(new SystemTranslatable),
    m_language(new SystemTranslatable),
    m_languageDescription(new SystemTranslatable),
    m_languageSelectedDescription(new SystemTranslatable),
    m_confirm(new SystemTranslatable),
    m_ok(new SystemTranslatable),
    m_yes(new SystemTranslatable),
    m_no(new SystemTranslatable),
    m_add(new SystemTranslatable),
    m_remove(new SystemTranslatable),
    m_shop(new SystemTranslatable),
    m_buy(new SystemTranslatable),
    m_sell(new SystemTranslatable),
    m_owned(new SystemTranslatable),
    m_selectAnAlly(new SystemTranslatable),
    m_victory(new SystemTranslatable),
    m_defeat(new SystemTranslatable),
    m_levelUp(new SystemTranslatable),
    m_precision(new SystemTranslatable),
    m_critical(new SystemTranslatable),
    m_damage(new SystemTranslatable),
    m_heal(new SystemTranslatable),
    m_skill(new SystemTranslatable),
    m_performSkill(new SystemTranslatable),
    m_loading(new SystemTranslatable),
    m_equipQuestion(new SystemTranslatable),
    m_pressAnyKeys(new SystemTranslatable),
    m_target(new SystemTranslatable)
{

}

LangsDatas::~LangsDatas()
{
    SuperListItem::deleteModel(m_model);
    delete m_loadAGame;
    delete m_loadAGameDescription;
    delete m_slot;
    delete m_empty;
    delete m_saveAGame;
    delete m_saveAGameDescription;
    delete m_keyboardAssignment;
    delete m_keyboardAssignmentDescription;
    delete m_keyboardAssignmentSelectedDescription;
    delete m_language;
    delete m_languageDescription;
    delete m_languageSelectedDescription;
    delete m_confirm;
    delete m_ok;
    delete m_yes;
    delete m_no;
    delete m_add;
    delete m_remove;
    delete m_shop;
    delete m_buy;
    delete m_sell;
    delete m_owned;
    delete m_selectAnAlly;
    delete m_victory;
    delete m_defeat;
    delete m_levelUp;
    delete m_precision;
    delete m_critical;
    delete m_damage;
    delete m_heal;
    delete m_skill;
    delete m_performSkill;
    delete m_loading;
    delete m_equipQuestion;
    delete m_pressAnyKeys;
    delete m_target;
}

QStandardItemModel * LangsDatas::model() const
{
    return m_model;
}

SystemTranslatable * LangsDatas::loadAGame() const
{
    return m_loadAGame;
}

SystemTranslatable * LangsDatas::loadAGameDescription() const
{
    return m_loadAGameDescription;
}

SystemTranslatable * LangsDatas::slot() const
{
    return m_slot;
}

SystemTranslatable * LangsDatas::empty() const
{
    return m_empty;
}

SystemTranslatable * LangsDatas::saveAGame() const
{
    return m_saveAGame;
}

SystemTranslatable * LangsDatas::saveAGameDescription() const
{
    return m_saveAGameDescription;
}

SystemTranslatable * LangsDatas::keyboardAssignment() const
{
    return m_keyboardAssignment;
}

SystemTranslatable * LangsDatas::keyboardAssignmentDescription() const
{
    return m_keyboardAssignmentDescription;
}

SystemTranslatable * LangsDatas::keyboardAssignmentSelectedDescription() const
{
    return m_keyboardAssignmentSelectedDescription;
}

SystemTranslatable * LangsDatas::language() const
{
    return m_language;
}

SystemTranslatable * LangsDatas::languageDescription() const
{
    return m_languageDescription;
}

SystemTranslatable * LangsDatas::languageSelectedDescription() const
{
    return m_languageSelectedDescription;
}

SystemTranslatable * LangsDatas::confirm() const
{
    return m_confirm;
}

SystemTranslatable * LangsDatas::ok() const
{
    return m_ok;
}

SystemTranslatable * LangsDatas::yes() const
{
    return m_yes;
}

SystemTranslatable * LangsDatas::no() const
{
    return m_no;
}

SystemTranslatable * LangsDatas::add() const
{
    return m_add;
}

SystemTranslatable * LangsDatas::remove() const
{
    return m_remove;
}

SystemTranslatable * LangsDatas::shop() const
{
    return m_shop;
}

SystemTranslatable * LangsDatas::buy() const
{
    return m_buy;
}

SystemTranslatable * LangsDatas::sell() const
{
    return m_sell;
}

SystemTranslatable * LangsDatas::owned() const
{
    return m_owned;
}

SystemTranslatable * LangsDatas::selectAnAlly() const
{
    return m_selectAnAlly;
}

SystemTranslatable * LangsDatas::victory() const
{
    return m_victory;
}

SystemTranslatable * LangsDatas::defeat() const
{
    return m_defeat;
}

SystemTranslatable * LangsDatas::levelUp() const
{
    return m_levelUp;
}

SystemTranslatable * LangsDatas::precision() const
{
    return m_precision;
}

SystemTranslatable * LangsDatas::critical() const
{
    return m_critical;
}

SystemTranslatable * LangsDatas::damage() const
{
    return m_damage;
}

SystemTranslatable * LangsDatas::heal() const
{
    return m_heal;
}

SystemTranslatable * LangsDatas::skill() const
{
    return m_skill;
}

SystemTranslatable * LangsDatas::performSkill() const
{
    return m_performSkill;
}

SystemTranslatable * LangsDatas::loading() const
{
    return m_loading;
}

SystemTranslatable * LangsDatas::equipQuestion() const
{
    return m_equipQuestion;
}

SystemTranslatable * LangsDatas::pressAnyKeys() const
{
    return m_pressAnyKeys;
}

SystemTranslatable * LangsDatas::target() const
{
    return m_target;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

int LangsDatas::mainLang() const
{
    return reinterpret_cast<SystemLanguage *>(m_model->item(0)->data().value<quintptr>())->id();
}

// -------------------------------------------------------

void LangsDatas::read(QString path)
{
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_LANGS), *this);
}

// -------------------------------------------------------

void LangsDatas::setDefault()
{
    SuperListItem::deleteModel(m_model, false);
    int index = RPM::get()->translations()->indexOfLanguagesShort(RPM::get()
        ->engineSettings()->currentLanguage());
    m_model->appendRow((new SystemLanguage(1, RPM::get()->translations()
        ->languagesNames().at(index), static_cast<LanguageKind>(index + 1)))
        ->getModelRow());
}

// -------------------------------------------------------

void LangsDatas::setDefaultTranslations()
{
    m_loadAGame->setName(RPM::translate(Translations::LOAD_GAME));
    m_loadAGameDescription->setName(RPM::translate(Translations::LOAD_GAME_DESCRIPTION));
    m_slot->setName(RPM::translate(Translations::SLOT_NAME));
    m_empty->setName(RPM::translate(Translations::EMPTY));
    m_saveAGame->setName(RPM::translate(Translations::SAVE_GAME));
    m_saveAGameDescription->setName(RPM::translate(Translations::SAVE_GAME_DESCRIPTION));
    m_keyboardAssignment->setName(RPM::translate(Translations::KEYBOARD_ASSIGNMENTS));
    m_keyboardAssignmentDescription->setName(RPM::translate(Translations::KEYBOARD_ASSIGNMENTS_DESCRIPTION));
    m_keyboardAssignmentSelectedDescription->setName(RPM::translate(Translations::KEYBOARD_ASSIGNMENTS_SELECTED_DESCRIPTION));
    m_language->setName(RPM::translate(Translations::LANGUAGE));
    m_languageDescription->setName(RPM::translate(Translations::LANGUAGE_DESCRIPTION));
    m_languageSelectedDescription->setName(RPM::translate(Translations::LANGUAGE_SELECTED_DESCRIPTION));
    m_confirm->setName(RPM::translate(Translations::CONFIRM_QUESTION));
    m_ok->setName(RPM::translate(Translations::OK));
    m_yes->setName(RPM::translate(Translations::YES));
    m_no->setName(RPM::translate(Translations::NO));
    m_add->setName(RPM::translate(Translations::ADD));
    m_remove->setName(RPM::translate(Translations::REMOVE));
    m_shop->setName(RPM::translate(Translations::SHOP));
    m_buy->setName(RPM::translate(Translations::BUY));
    m_sell->setName(RPM::translate(Translations::SELL));
    m_owned->setName(RPM::translate(Translations::OWNED));
    m_selectAnAlly->setName(RPM::translate(Translations::SELECT_AN_ALLY));
    m_victory->setName(RPM::translate(Translations::VICTORY));
    m_defeat->setName(RPM::translate(Translations::DEFEAT));
    m_levelUp->setName(RPM::translate(Translations::LEVEL_UP));
    m_precision->setName(RPM::translate(Translations::PRECISION));
    m_critical->setName(RPM::translate(Translations::CRITICAL));
    m_damage->setName(RPM::translate(Translations::DAMAGE));
    m_heal->setName(RPM::translate(Translations::HEAL));
    m_skill->setName(RPM::translate(Translations::SKILL));
    m_performSkill->setName(RPM::translate(Translations::PERFORM_SKILL));
    m_loading->setName(RPM::translate(Translations::EXTRA_LOADING));
    m_equipQuestion->setName(RPM::translate(Translations::EQUIP_QUESTION));
    m_pressAnyKeys->setName(RPM::translate(Translations::PRESS_ANY_KEYS));
    m_target->setName(RPM::translate(Translations::TARGET));
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void LangsDatas::read(const QJsonObject &json)
{
    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    SuperListItem::readTree(m_model, new SystemLanguage, json, JSON_LANGS);
    m_loadAGame->read(json["lag"].toObject());
    m_loadAGameDescription->read(json["lagd"].toObject());
    m_slot->read(json["sl"].toObject());
    m_empty->read(json["em"].toObject());
    m_saveAGame->read(json["sag"].toObject());
    m_saveAGameDescription->read(json["sagd"].toObject());
    m_keyboardAssignment->read(json["ka"].toObject());
    m_keyboardAssignmentDescription->read(json["kad"].toObject());
    m_keyboardAssignmentSelectedDescription->read(json["kasd"].toObject());
    m_language->read(json["l"].toObject());
    m_languageDescription->read(json["ld"].toObject());
    m_languageSelectedDescription->read(json["lsd"].toObject());
    m_confirm->read(json["co"].toObject());
    m_ok->read(json["ok"].toObject());
    m_yes->read(json["ye"].toObject());
    m_no->read(json["no"].toObject());
    m_add->read(json["ad"].toObject());
    m_remove->read(json["re"].toObject());
    m_shop->read(json["sh"].toObject());
    m_buy->read(json["bu"].toObject());
    m_sell->read(json["se"].toObject());
    m_owned->read(json["ow"].toObject());
    m_selectAnAlly->read(json["saa"].toObject());
    m_victory->read(json["vi"].toObject());
    m_defeat->read(json["de"].toObject());
    m_levelUp->read(json["lu"].toObject());
    m_precision->read(json["pr"].toObject());
    m_critical->read(json["cr"].toObject());
    m_damage->read(json["da"].toObject());
    m_heal->read(json["he"].toObject());
    m_skill->read(json["sk"].toObject());
    m_performSkill->read(json["ps"].toObject());
    m_loading->read(json["lo"].toObject());
    m_equipQuestion->read(json["eq"].toObject());
    m_pressAnyKeys->read(json["pak"].toObject());
    m_target->read(json["ta"].toObject());
}

// -------------------------------------------------------

void LangsDatas::write(QJsonObject &json) const
{
    SuperListItem::writeTree(m_model, json, JSON_LANGS);
    QJsonObject obj;
    m_loadAGame->write(obj);
    json["lag"] = obj;
    obj = QJsonObject();
    m_loadAGameDescription->write(obj);
    json["lagd"] = obj;
    obj = QJsonObject();
    m_slot->write(obj);
    json["sl"] = obj;
    obj = QJsonObject();
    m_empty->write(obj);
    json["em"] = obj;
    obj = QJsonObject();
    m_saveAGame->write(obj);
    json["sag"] = obj;
    obj = QJsonObject();
    m_saveAGameDescription->write(obj);
    json["sagd"] = obj;
    obj = QJsonObject();
    m_keyboardAssignment->write(obj);
    json["ka"] = obj;
    obj = QJsonObject();
    m_keyboardAssignmentDescription->write(obj);
    json["kad"] = obj;
    obj = QJsonObject();
    m_keyboardAssignmentSelectedDescription->write(obj);
    json["kasd"] = obj;
    obj = QJsonObject();
    m_language->write(obj);
    json["l"] = obj;
    obj = QJsonObject();
    m_languageDescription->write(obj);
    json["ld"] = obj;
    obj = QJsonObject();
    m_languageSelectedDescription->write(obj);
    json["lsd"] = obj;
    obj = QJsonObject();
    m_confirm->write(obj);
    json["co"] = obj;
    obj = QJsonObject();
    m_ok->write(obj);
    json["ok"] = obj;
    obj = QJsonObject();
    m_yes->write(obj);
    json["ye"] = obj;
    obj = QJsonObject();
    m_no->write(obj);
    json["no"] = obj;
    obj = QJsonObject();
    m_add->write(obj);
    json["ad"] = obj;
    obj = QJsonObject();
    m_remove->write(obj);
    json["re"] = obj;
    obj = QJsonObject();
    m_shop->write(obj);
    json["sh"] = obj;
    obj = QJsonObject();
    m_buy->write(obj);
    json["bu"] = obj;
    obj = QJsonObject();
    m_sell->write(obj);
    json["se"] = obj;
    obj = QJsonObject();
    m_owned->write(obj);
    json["ow"] = obj;
    obj = QJsonObject();
    m_selectAnAlly->write(obj);
    json["saa"] = obj;
    obj = QJsonObject();
    m_victory->write(obj);
    json["vi"] = obj;
    obj = QJsonObject();
    m_defeat->write(obj);
    json["de"] = obj;
    obj = QJsonObject();
    m_levelUp->write(obj);
    json["lu"] = obj;
    obj = QJsonObject();
    m_precision->write(obj);
    json["pr"] = obj;
    obj = QJsonObject();
    m_critical->write(obj);
    json["cr"] = obj;
    obj = QJsonObject();
    m_damage->write(obj);
    json["da"] = obj;
    obj = QJsonObject();
    m_heal->write(obj);
    json["he"] = obj;
    obj = QJsonObject();
    m_skill->write(obj);
    json["sk"] = obj;
    obj = QJsonObject();
    m_performSkill->write(obj);
    json["ps"] = obj;
    obj = QJsonObject();
    m_loading->write(obj);
    json["lo"] = obj;
    obj = QJsonObject();
    m_equipQuestion->write(obj);
    json["eq"] = obj;
    obj = QJsonObject();
    m_pressAnyKeys->write(obj);
    json["pak"] = obj;
    obj = QJsonObject();
    m_target->write(obj);
    json["ta"] = obj;
}
