/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
    for (int i = 0; i < ids.size(); i++)
        m_names[ids[i]] = names[i];
}

LangsTranslation::~LangsTranslation()
{

}

int LangsTranslation::mainId() const{
    int i;
    if (RPM::get()->project() == nullptr)
        i = 1;
    else
        i = RPM::get()->project()->langsDatas()->mainLang();

    return i;
}

QString LangsTranslation::mainName() const{
    return m_names[mainId()];
}

void LangsTranslation::setMainName(QString n){
    m_names[mainId()] = n;
}

QString LangsTranslation::defaultMainName() const{
    return m_names[1];
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void LangsTranslation::setCopy(const LangsTranslation& super){
    m_names = super.m_names;
}

// -------------------------------------------------------

void LangsTranslation::updateNames(){
    QHash<int,QString> names = m_names;
    LangsDatas* datas = RPM::get()->project()->langsDatas();
    int l;

    l = datas->model()->invisibleRootItem()->rowCount();
    for (int i = 0; i < l - 1; i++){
        int entry = ((SuperListItem*) datas->model()->item(i)->data()
                     .value<quintptr>())->id();
        m_names[entry] = names[entry];
    }
}

// -------------------------------------------------------

void LangsTranslation::setAllNames(QString n){
    QHash<int, QString>::const_iterator i;
    for (i = m_names.begin(); i != m_names.end(); i++){
        m_names[i.key()] = n;
    }
}

// -------------------------------------------------------

bool LangsTranslation::isEmpty() const {
    QHash<int, QString>::const_iterator i;

    for (i = m_names.begin(); i != m_names.end(); i++){
        if (!i.value().isEmpty()) {
            return false;
        }
    }

    return true;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void LangsTranslation::read(const QJsonObject &json){
    QJsonObject::const_iterator i;
    for (i = json.begin(); i != json.end(); i++){
        m_names[i.key().toInt()] = i.value().toString();
    }
}

void LangsTranslation::write(QJsonObject &json) const{
    QHash<int, QString>::const_iterator i;
    for (i = m_names.begin(); i != m_names.end(); i++){
        json[QString::number(i.key())] = i.value();
    }
}
