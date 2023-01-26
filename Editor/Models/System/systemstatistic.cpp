/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

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
    SystemTranslatable(),
    m_pictureBarID(new SuperListItem(-1))
{

}

SystemStatistic::SystemStatistic(int i, QString name, QString abbreviation, bool
    isFix, SuperListItem * pictureBarID) :
    SystemTranslatable(i, name),
    m_abbreviation(abbreviation),
    m_isFix(isFix),
    m_pictureBarID(pictureBarID)
{

}

SystemStatistic::~SystemStatistic()
{
    delete m_pictureBarID;
}

QString SystemStatistic::abbreviation() const { return m_abbreviation; }

void SystemStatistic::setAbbreviation(QString s) { m_abbreviation = s; }

bool SystemStatistic::isFix() const { return m_isFix; }

void SystemStatistic::setIsFix(bool b) { m_isFix = b; }

SuperListItem * SystemStatistic::pictureBarID() const
{
    return m_pictureBarID;
}

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
    m_pictureBarID->setId(statistic->m_pictureBarID->id());
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
    if (json.contains("pid"))
    {
        m_pictureBarID->setId(json["pid"].toInt());
    }
}

// -------------------------------------------------------

void SystemStatistic::write(QJsonObject &json) const{
    SystemTranslatable::write(json);
    json["abr"] = m_abbreviation;
    json["fix"] = m_isFix;
    if (m_pictureBarID->id() != -1)
    {
        json["pid"] = m_pictureBarID->id();
    }
}
