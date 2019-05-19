/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGNEWPROJECT_H
#define DIALOGNEWPROJECT_H

#include <QDialog>
#include "controlnewproject.h"

// -------------------------------------------------------
//
//  CLASS DialogNewProject
//
//  A dialog used for creating a new project.
//
// -------------------------------------------------------

namespace Ui {
class DialogNewProject;
}

class DialogNewProject : public QDialog
{
    Q_OBJECT

public:
    explicit DialogNewProject(QWidget *parent = 0);
    ~DialogNewProject();
    void filterDirectoryName(const QString & s);
    QString getProjectName() const;
    QString getDirectoryName() const;
    QString getLocation() const;

private:
    Ui::DialogNewProject *ui;
    ControlNewproject m_control;

private slots:
    void on_lineEditProjectName_textChanged(const QString & s);
    void on_lineEditDirectoryName_editingFinished();
    void on_pushButtonLocation_clicked();
    void accept();
};

#endif // DIALOGNEWPROJECT_H
