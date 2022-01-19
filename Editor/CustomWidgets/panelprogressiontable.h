/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELPROGRESSIONTABLE_H
#define PANELPROGRESSIONTABLE_H

// -------------------------------------------------------
//
//  CLASS PanelProgressionTable
//
//  A panel used for progression tables (monsters rewards).
//
// -------------------------------------------------------

#include <QWidget>
#include "systemprogressiontable.h"

namespace Ui {
class PanelProgressionTable;
}

class PanelProgressionTable : public QWidget
{
    Q_OBJECT

public:
    static const QString NAME_EXPERIENCE;

    explicit PanelProgressionTable(QWidget *parent = nullptr);
    ~PanelProgressionTable();
    SystemProgressionTable * progression() const;
    void setProgression(SystemProgressionTable *progression);
    int maxLevel() const;
    void setMaxLevel(int l);

    void updateProgress();
    void gotoGraph();

protected:
    bool eventFilter(QObject *o, QEvent *e);

private:
    Ui::PanelProgressionTable *ui;
    SystemProgressionTable *m_progression;
    bool m_updating;
    int m_maxLevel;

    void translate();

signals:
    void finalValueUpdated(int f);

public slots:
    void on_tabWidget_currentChanged(int index);
    void on_spinBoxInitValueChanged(int);
    void on_spinBoxFinalValueChanged(int i);
    void on_sliderProgressionValueChanged(int i);
    void on_pushButtonReset_clicked();
};

#endif // PANELPROGRESSIONTABLE_H
