/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETCUSTOMSTRUCTURE_H
#define WIDGETCUSTOMSTRUCTURE_H

#include <QWidget>
#include <QListWidgetItem>
#include "systemcustomstructure.h"

// -------------------------------------------------------
//
//  CLASS WidgetCustomStructure
//
//  Widget used for creating a custom structure.
//
// -------------------------------------------------------

namespace Ui {
class WidgetCustomStructure;
}

class WidgetCustomStructure : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetCustomStructure(QWidget *parent = nullptr);
    ~WidgetCustomStructure();

    void initialize(SystemCustomStructure *custom);
    void openDialog();
    void updateText();

private:
    Ui::WidgetCustomStructure *ui;
    SystemCustomStructure *m_custom;

signals:
    void windowClosed();

private slots:
    void on_listWidget_itemDoubleClicked(QListWidgetItem *);
    void on_pushButton_clicked();
};

#endif // WIDGETCUSTOMSTRUCTURE_H
