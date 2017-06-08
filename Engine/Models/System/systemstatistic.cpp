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
                                 QVector<QString> commands) :
    SystemLang(i,names),
    m_abbreviation(abbreviation),
    m_commands(commands)
{

}

SystemStatistic::~SystemStatistic(){

}

QString SystemStatistic::abbreviation() const { return m_abbreviation; }

QVector<QString> SystemStatistic::commands() const {return m_commands; }

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

void SystemStatistic::setCopy(const SystemStatistic& statistic){
    SystemLang::setCopy(statistic);
    m_abbreviation = statistic.abbreviation();
    m_commands = statistic.commands();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemStatistic::read(const QJsonObject &json){
    SystemLang::read(json);
    m_abbreviation = json["abr"].toString();

    m_commands.clear();
    QJsonArray jsonCommands = json["commands"].toArray();
    for (int i = 0; i < jsonCommands.size(); i++)
        m_commands.append(jsonCommands.at(i).toString());
}

// -------------------------------------------------------

void SystemStatistic::write(QJsonObject &json) const{
    SystemLang::write(json);
    json["abr"] = m_abbreviation;

    QJsonArray jsonCommands;
    for (int i = 0; i < m_commands.size(); i++)
        jsonCommands.append(m_commands.at(i));
    json["commands"] = jsonCommands;
}
