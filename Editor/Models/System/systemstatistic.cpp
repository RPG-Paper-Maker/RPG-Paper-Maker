/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemstatistic.h"
#include "dialogsystemstatistic.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemStatistic::SystemStatistic() :
    SystemTranslatable()
{

}

SystemStatistic::SystemStatistic(int i, QString name, QString abbreviation, bool
    isFix) :
    SystemTranslatable(i, name),
    m_abbreviation(abbreviation),
    m_isFix(isFix)
{

}

SystemStatistic::~SystemStatistic(){

}

QString SystemStatistic::abbreviation() const { return m_abbreviation; }

void SystemStatistic::setAbbreviation(QString s) { m_abbreviation = s; }

bool SystemStatistic::isFix() const { return m_isFix; }

void SystemStatistic::setIsFix(bool b) { m_isFix = b; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool SystemStatistic::openDialog(){
    SystemStatistic statistic;
    statistic.setCopy(*this);
    DialogSystemStatistic dialog(statistic);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(statistic);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemStatistic::createCopy() const{
    SystemStatistic* super = new SystemStatistic;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemStatistic::setCopy(const SuperListItem &super) {
    const SystemStatistic *statistic;

    SystemTranslatable::setCopy(super);

    statistic = reinterpret_cast<const SystemStatistic *>(&super);
    m_abbreviation = statistic->abbreviation();
    m_isFix = statistic->m_isFix;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemStatistic::read(const QJsonObject &json){
    SystemTranslatable::read(json);
    m_abbreviation = json["abr"].toString();
    m_isFix = json["fix"].toBool();
}

// -------------------------------------------------------

void SystemStatistic::write(QJsonObject &json) const{
    SystemTranslatable::write(json);
    json["abr"] = m_abbreviation;
    json["fix"] = m_isFix;
}
