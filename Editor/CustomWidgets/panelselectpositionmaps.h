/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELSELECTPOSITIONMAPS_H
#define PANELSELECTPOSITIONMAPS_H

#include <QWidget>
#include <QModelIndex>
#include "treemapdatas.h"

// -------------------------------------------------------
//
//  CLASS PanelSelectPositionMaps
//
//  A panel used for selecting a map and a position.
//
// -------------------------------------------------------

namespace Ui {
class PanelSelectPositionMaps;
}

class PanelSelectPositionMaps : public QWidget
{
    Q_OBJECT

public:
    explicit PanelSelectPositionMaps(QWidget *parent = nullptr);
    ~PanelSelectPositionMaps();
    int idMap() const;
    QString mapName() const;
    int x() const;
    int y() const;
    int yPlus() const;
    int z() const;

    TreeMapTag * currentTag() const;
    void initialize(int idMap, int x, int y, int yPlus, int z);

private:
    Ui::PanelSelectPositionMaps *ui;
    TreeMapDatas* m_treeMapDatas;

private slots:
    void on_spinBoxX_valueChanged(int i);
    void on_spinBoxY_valueChanged(int i);
    void on_spinBoxYplus_valueChanged(int i);
    void on_spinBoxZ_valueChanged(int i);
};

#endif // PANELSELECTPOSITIONMAPS_H
