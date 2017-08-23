/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#include "systemstatistic.h"
#include "dialogsystemstatistic.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemStatistic::SystemStatistic() : SystemLang()
{

}

SystemStatistic::SystemStatistic(int i, LangsTranslation* names,
                                 QString abbreviation,
                                 bool isFix) :
    SystemLang(i,names),
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

void SystemStatistic::setCopy(const SystemStatistic& statistic){
    SystemLang::setCopy(statistic);
    m_abbreviation = statistic.abbreviation();
    m_isFix = statistic.m_isFix;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemStatistic::read(const QJsonObject &json){
    SystemLang::read(json);
    m_abbreviation = json["abr"].toString();
    m_isFix = json["fix"].toBool();
}

// -------------------------------------------------------

void SystemStatistic::write(QJsonObject &json) const{
    SystemLang::write(json);
    json["abr"] = m_abbreviation;
    json["fix"] = m_isFix;
}
