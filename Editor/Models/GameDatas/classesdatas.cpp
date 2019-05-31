/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "classesdatas.h"
#include "systemclass.h"
#include "systemstatisticprogression.h"
#include "systemclassskill.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ClassesDatas::ClassesDatas()
{
    m_model = new QStandardItemModel;
}

ClassesDatas::~ClassesDatas()
{
    SuperListItem::deleteModel(m_model);
}

void ClassesDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::pathClasses), *this);
}

QStandardItemModel* ClassesDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void ClassesDatas::setDefault(QStandardItem *modelSkills,
                              QStandardItem *modelStatistics)
{
    SystemClass* sysClass;
    QStandardItem* item;
    SuperListItem* skill;
    SuperListItem* statistic;
    SystemStatisticProgression* statisticProgression;
    SystemClassSkill* classSkill;
    QList<QStandardItem *> row;
    QStandardItemModel* skills;
    QStandardItemModel* statisticsProgression;
    QString names[] = {"Knight", "Witch", "Mage", "Ninja", "Animal"};
    int initialLevels[] = {1, 1, 1, 1, 1};
    int maxLevels[] = {100, 100, 100, 100, 100};
    int expBases[] = {5, 5, 5, 5, 5};
    int expInflations[] = {20, 20, 20, 20, 20};
    QVector<int> idsStatistics[] = {
        QVector<int>({3, 4, 5, 6, 7, 8, 9, 10, 11, 12}),
        QVector<int>({3, 4, 5, 6, 7, 8, 9, 10, 11, 12}),
        QVector<int>({3, 4, 5, 6, 7, 8, 9, 10, 11, 12}),
        QVector<int>({3, 4, 5, 6, 7, 8, 9, 10, 11, 12}),
        QVector<int>({3, 4, 5, 6, 7, 8, 9, 10, 11, 12})
    };
    QVector<bool> isFix[] = {
        QVector<bool>({true, true, true, false, false, true, true, true, true,
            true}),
        QVector<bool>({true, true, true, false, false, true, true, true, true,
            true}),
        QVector<bool>({true, true, true, false, false, true, true, true, true,
            true}),
        QVector<bool>({true, true, true, false, false, true, true, true, true,
            true}),
        QVector<bool>({true, true, true, false, false, true, true, true, true,
            true})
    };
    QVector<int> initialValue[] = {
        QVector<int>({20, 10, 10, 1, 1, 1, 1, 0, 0, 1}),
        QVector<int>({20, 10, 10, 1, 1, 1, 1, 0, 0, 1}),
        QVector<int>({20, 10, 10, 1, 1, 1, 1, 0, 0, 1}),
        QVector<int>({20, 10, 10, 1, 1, 1, 1, 0, 0, 1}),
        QVector<int>({5, 10, 10, 1, 1, 1, 1, 0, 0, 1})
    };
    QVector<int> finalValue[] = {
        QVector<int>({1000, 500, 100, 999, 999, 200, 200, 50, 50, 200}),
        QVector<int>({1000, 500, 100, 999, 999, 200, 200, 50, 50, 200}),
        QVector<int>({1000, 500, 100, 999, 999, 200, 200, 50, 50, 200}),
        QVector<int>({1000, 500, 100, 999, 999, 200, 200, 50, 50, 200}),
        QVector<int>({1000, 500, 100, 999, 999, 200, 200, 50, 50, 200})
    };
    QVector<QString> formula[] = {
        QVector<QString>({"", "", "", "Math.ceil(u.str * 0.3)",
            "Math.ceil(u.int * 0.3)", "", "", "", "", ""}),
        QVector<QString>({"", "", "", "Math.ceil(u.str * 0.3)",
            "Math.ceil(u.int * 0.3)", "", "", "", "", ""}),
        QVector<QString>({"", "", "", "Math.ceil(u.str * 0.3)",
            "Math.ceil(u.int * 0.3)", "", "", "", "", ""}),
        QVector<QString>({"", "", "", "Math.ceil(u.str * 0.3)",
            "Math.ceil(u.int * 0.3)", "", "", "", "", ""}),
        QVector<QString>({"", "", "", "Math.ceil(u.str * 0.3)",
            "Math.ceil(u.int * 0.3)", "", "", "", "", ""})
    };
    QVector<int> skillIds[] = {
        QVector<int>({6}),
        QVector<int>({7}),
        QVector<int>({8, 9, 10, 11}),
        QVector<int>({12, 13}),
        QVector<int>({})
    };
    QVector<int> skillLevels[] = {
        QVector<int>({1}),
        QVector<int>({1}),
        QVector<int>({1,1,5,10}),
        QVector<int>({1, 5}),
        QVector<int>({})
    };

    int length = (sizeof(names)/sizeof(*names));

    for (int i = 0; i < length; i++){
        // Statistics progression
        statisticsProgression = new QStandardItemModel;
        for (int j = 0; j < idsStatistics[i].size(); j++){
            statistic = SuperListItem::getById(modelStatistics, idsStatistics[i]
                [j]);
            statisticProgression = new SystemStatisticProgression(statistic->id(),
                statistic->name(), new PrimitiveValue(finalValue[i][j]), isFix
                [i][j], new SystemProgressionTable(new PrimitiveValue(
                initialValue[i][j]), new PrimitiveValue(finalValue[i][j]), 0),
                new PrimitiveValue(0), new PrimitiveValue(formula[i][j]));
            row = statisticProgression->getModelRow();
            statisticsProgression->appendRow(row);
        }
        statisticsProgression->appendRow(SuperListItem::getEmptyItem());

        // Skills
        skills = new QStandardItemModel;
        for (int j = 0; j < skillIds[i].size(); j++){
            skill = SuperListItem::getById(modelSkills, skillIds[i][j]);
            classSkill = new SystemClassSkill(skill->id(), skill->name(),
                                              skillLevels[i][j]);
            row = classSkill->getModelRow();
            skills->appendRow(row);
        }
        skills->appendRow(SuperListItem::getEmptyItem());

        sysClass = new SystemClass(i + 1, new LangsTranslation(names[i]),
            initialLevels[i], maxLevels[i], expBases[i], expInflations[i],
            statisticsProgression, skills);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysClass)));
        item->setText(sysClass->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void ClassesDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json["classes"].toArray();
    QStandardItem* item;
    SystemClass* sysClass;
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        sysClass= new SystemClass;
        sysClass->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysClass)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysClass->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void ClassesDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;
    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonCommon;
        SystemClass* sysClass = ((SystemClass*)m_model->item(i)
                                 ->data().value<quintptr>());
        sysClass->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["classes"] = jsonArray;
}
