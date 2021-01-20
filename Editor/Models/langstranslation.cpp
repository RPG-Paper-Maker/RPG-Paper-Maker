/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "langstranslation.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

LangsTranslation::LangsTranslation()
{

}

LangsTranslation::LangsTranslation(QString name) :
    LangsTranslation()
{
    m_names[1] = name;
}

LangsTranslation::LangsTranslation(QVector<int> ids, QVector<QString> names) :
    LangsTranslation()
{
    for (int i = 0, l = ids.size(); i < l; i++) {
        m_names[ids[i]] = names[i];
    }
}

LangsTranslation::~LangsTranslation() {

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

int LangsTranslation::mainID() const {
    int i;

    if (RPM::get()->project() == nullptr) {
        i = 1;
    } else {
        i = RPM::get()->project()->langsDatas()->mainLang();
    }

    return i;
}

// -------------------------------------------------------

QString LangsTranslation::mainName() const {
    return m_names[this->mainID()];
}

// -------------------------------------------------------

void LangsTranslation::setMainName(QString n) {
    m_names[this->mainID()] = n;
}

// -------------------------------------------------------

QString LangsTranslation::defaultMainName() const {
    return m_names[1];
}

// -------------------------------------------------------

void LangsTranslation::setCopy(const LangsTranslation &super) {
    m_names = super.m_names;
}

// -------------------------------------------------------

void LangsTranslation::updateNames() {
    QHash<int, QString> names;
    LangsDatas *datas;
    int i, l, entry;

    names = m_names;
    datas = RPM::get()->project()->langsDatas();
    for (i = 0, l = datas->model()->invisibleRootItem()->rowCount(); i < l - 1;
         i++)
    {
        entry = reinterpret_cast<SuperListItem *>(datas->model()->item(i)
            ->data().value<quintptr>())->id();
        m_names[entry] = names[entry];
    }
}

// -------------------------------------------------------

void LangsTranslation::setAllNames(QString n) {
    QHash<int, QString>::const_iterator i;
    for (i = m_names.begin(); i != m_names.end(); i++) {
        m_names[i.key()] = n;
    }
}

// -------------------------------------------------------

bool LangsTranslation::isEmpty() const {
    QHash<int, QString>::const_iterator i;

    for (i = m_names.begin(); i != m_names.end(); i++) {
        if (!i.value().isEmpty()) {
            return false;
        }
    }

    return true;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void LangsTranslation::getCommand(QVector<QString> &command) {
    QHash<int, QString>::const_iterator i;

    for (i = m_names.begin(); i != m_names.end(); i++) {
        command.append(QString::number(i.key()));
        command.append(i.value());
    }
}

// -------------------------------------------------------

void LangsTranslation::initializeCommand(const EventCommand *command, int &i) {
    int id;
    QString name;

    id = command->valueCommandAt(i++).toInt();
    name = command->valueCommandAt(i++);
    m_names[id] = name;
}

// -------------------------------------------------------

void LangsTranslation::read(const QJsonObject &json) {
    QJsonObject::const_iterator i;
    for (i = json.begin(); i != json.end(); i++) {
        m_names[i.key().toInt()] = i.value().toString();
    }
}

// -------------------------------------------------------

void LangsTranslation::write(QJsonObject &json) const {
    QHash<int, QString>::const_iterator i;
    for (i = m_names.begin(); i != m_names.end(); i++) {
        json[QString::number(i.key())] = i.value();
    }
}
