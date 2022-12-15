/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef LANGSDATAS_H
#define LANGSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"
#include "systemtranslatable.h"

// -------------------------------------------------------
//
//  CLASS LangDatas
//
//  The data file is located in
//  Content/Datas/langs.json.
//
// -------------------------------------------------------

class LangsDatas : public Serializable
{
public:
    static const QString JSON_LANGS;

    LangsDatas();
    virtual ~LangsDatas();
    QStandardItemModel * model() const;
    SystemTranslatable * loadAGame() const;
    SystemTranslatable * loadAGameDescription() const;
    SystemTranslatable * slot() const;
    SystemTranslatable * empty() const;
    SystemTranslatable * saveAGame() const;
    SystemTranslatable * saveAGameDescription() const;
    SystemTranslatable * keyboardAssignment() const;
    SystemTranslatable * keyboardAssignmentDescription() const;
    SystemTranslatable * keyboardAssignmentSelectedDescription() const;
    SystemTranslatable * language() const;
    SystemTranslatable * languageDescription() const;
    SystemTranslatable * languageSelectedDescription() const;
    SystemTranslatable * confirm() const;
    SystemTranslatable * ok() const;
    SystemTranslatable * yes() const;
    SystemTranslatable * no() const;
    SystemTranslatable * add() const;
    SystemTranslatable * remove() const;
    SystemTranslatable * shop() const;
    SystemTranslatable * buy() const;
    SystemTranslatable * sell() const;
    SystemTranslatable * owned() const;
    SystemTranslatable * selectAnAlly() const;
    SystemTranslatable * victory() const;
    SystemTranslatable * defeat() const;
    SystemTranslatable * levelUp() const;
    SystemTranslatable * precision() const;
    SystemTranslatable * critical() const;
    SystemTranslatable * damage() const;
    SystemTranslatable * heal() const;
    SystemTranslatable * skill() const;
    SystemTranslatable * performSkill() const;
    SystemTranslatable * loading() const;
    SystemTranslatable * equipQuestion() const;
    SystemTranslatable * pressAnyKeys() const;
    SystemTranslatable * target() const;

    int mainLang() const;
    void read(QString path);
    void setDefault();
    void setDefaultTranslations();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
    SystemTranslatable *m_loadAGame;
    SystemTranslatable *m_loadAGameDescription;
    SystemTranslatable *m_slot;
    SystemTranslatable *m_empty;
    SystemTranslatable *m_saveAGame;
    SystemTranslatable *m_saveAGameDescription;
    SystemTranslatable *m_keyboardAssignment;
    SystemTranslatable *m_keyboardAssignmentDescription;
    SystemTranslatable *m_keyboardAssignmentSelectedDescription;
    SystemTranslatable *m_language;
    SystemTranslatable *m_languageDescription;
    SystemTranslatable *m_languageSelectedDescription;
    SystemTranslatable *m_confirm;
    SystemTranslatable *m_ok;
    SystemTranslatable *m_yes;
    SystemTranslatable *m_no;
    SystemTranslatable *m_add;
    SystemTranslatable *m_remove;
    SystemTranslatable *m_shop;
    SystemTranslatable *m_buy;
    SystemTranslatable *m_sell;
    SystemTranslatable *m_owned;
    SystemTranslatable *m_selectAnAlly;
    SystemTranslatable *m_victory;
    SystemTranslatable *m_defeat;
    SystemTranslatable *m_levelUp;
    SystemTranslatable *m_precision;
    SystemTranslatable *m_critical;
    SystemTranslatable *m_damage;
    SystemTranslatable *m_heal;
    SystemTranslatable *m_skill;
    SystemTranslatable *m_performSkill;
    SystemTranslatable *m_loading;
    SystemTranslatable *m_equipQuestion;
    SystemTranslatable *m_pressAnyKeys;
    SystemTranslatable *m_target;
};

#endif // LANGSDATAS_H
