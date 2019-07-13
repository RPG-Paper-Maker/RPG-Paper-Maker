/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGPROGRESS_H
#define DIALOGPROGRESS_H

#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogProgress
//
//  Dialog used for displaying progress.
//
// -------------------------------------------------------

namespace Ui {
class DialogProgress;
}

class DialogProgress : public QDialog
{
    Q_OBJECT

public:
    explicit DialogProgress(QWidget *parent = 0);
    ~DialogProgress();

private:
    Ui::DialogProgress *ui;
    int m_totalCount;
    int m_count;
    int m_beginValue;
    int m_endValue;

public slots:
    void setValueLabel(int v, QString s);
    void setDescription(QString s);
    void setCount(int v);
    void addOne();
};

#endif // DIALOGPROGRESS_H
